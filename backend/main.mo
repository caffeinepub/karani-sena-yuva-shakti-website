import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Char "mo:core/Char";
import Nat32 "mo:core/Nat32";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type Candidate = {
    fullName : Text;
    fatherName : Text;
    dateOfBirth : Text;
    mobile : Text;
    lastQualification : Text;
    address : Text;
    createdAt : Nat;
    admissionID : Text;
    photo : ?Storage.ExternalBlob;
  };

  public type GalleryItem = {
    image : Storage.ExternalBlob;
    description : Text;
  };

  public type NewsItem = {
    title : Text;
    content : Text;
    createdAt : Nat;
  };

  module Candidate {
    public func compare(candidate1 : Candidate, candidate2 : Candidate) : Order.Order {
      Text.compare(candidate1.fullName, candidate2.fullName);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let candidates = Map.empty<Text, Candidate>();
  let gallery = Map.empty<Text, GalleryItem>();
  let newsItems = Map.empty<Text, NewsItem>();

  let admins = List.empty<Principal>();
  var superAdmin : ?Principal = null;
  var admissionCounter = 0;

  // Mobile number validation: Only 10 digit Indian numbers
  func isValidIndianMobileNumber(mobile : Text) : Bool {
    if (mobile.size() != 10) {
      return false;
    };
    let chars = mobile.toArray();
    for (c in chars.values()) {
      if (c.toNat32() < 48 or c.toNat32() > 57) {
        return false;
      };
    };
    true;
  };

  // Admin management
  public type AdminResponse = {
    principal : Principal;
    isSuperAdmin : Bool;
  };

  public shared ({ caller }) func initializeSuperAdmin() : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot be super admin");
    };
    if (superAdmin == null) {
      superAdmin := ?caller;
      admins.add(caller);
      true;
    } else {
      false;
    };
  };

  public shared ({ caller }) func addAdmin(newAdmin : Principal) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous principals cannot add admins");
    };
    if (newAdmin.isAnonymous()) {
      Runtime.trap("Cannot add anonymous principal as admin");
    };
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add other admins");
    };
    if (contains(admins.values(), newAdmin)) {
      false;
    } else {
      admins.add(newAdmin);
      AccessControl.assignRole(accessControlState, caller, newAdmin, #admin);
      true;
    };
  };

  public shared ({ caller }) func removeAdmin(adminToRemove : Principal) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous principals cannot remove admins");
    };
    if (not isSuperAdmin(caller)) {
      Runtime.trap("Unauthorized: Only super admin can remove admins");
    };
    if (isSuperAdmin(adminToRemove)) {
      false;
    } else {
      let newAdmins = admins.filter(func(existing) { existing != adminToRemove });
      admins.clear();
      admins.addAll(newAdmins.values());
      AccessControl.assignRole(accessControlState, caller, adminToRemove, #user);
      true;
    };
  };

  public query ({ caller }) func getAdmins() : async [AdminResponse] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view the admin list");
    };
    admins.toArray().map(
      func(admin) {
        {
          principal = admin;
          isSuperAdmin = superAdmin == ?admin;
        };
      }
    );
  };

  public shared ({ caller }) func resetAdminSystemForce() : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous principals cannot reset the system");
    };
    if (not ((admins.isEmpty() and superAdmin == null) or isSuperAdmin(caller))) {
      Runtime.trap("Unauthorized: Only super admin can reset the system");
    };
    admins.clear();
    superAdmin := ?caller;
    admins.add(caller);
  };

  func contains(iter : Iter.Iter<Principal>, value : Principal) : Bool {
    for (item in iter) {
      if (item == value) {
        return true;
      };
    };
    false;
  };

  func isSuperAdmin(caller : Principal) : Bool {
    if (caller.isAnonymous()) {
      return false;
    };
    switch (superAdmin) {
      case (null) { false };
      case (?admin) { caller == admin };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type SubmitAdmissionFormResult = {
    #ok;
    #err : Text;
  };

  public shared ({ caller }) func submitAdmissionForm(
    fullName : Text,
    fatherName : Text,
    dateOfBirth : Text,
    mobile : Text,
    lastQualification : Text,
    address : Text,
    photo : ?Storage.ExternalBlob,
  ) : async SubmitAdmissionFormResult {
    // Validate mobile number (Indian 10-digit)
    if (not isValidIndianMobileNumber(mobile)) {
      return #err("invalid_mobile_number");
    };

    // Check if mobile number already exists
    for ((_, candidate) in candidates.entries()) {
      if (candidate.mobile == mobile) {
        return #err("mobile_already_registered");
      };
    };

    // Now increment the counter and generate the new admission ID
    let currentCounter = admissionCounter;
    admissionCounter += 1;

    // Generate admission ID dynamically on each call
    let currentYear = 2023; // Placeholder for actual year retrieval
    let serialString = debug_show (currentCounter + 1);

    func zeroPad(text : Text) : Text {
      let textChars = text.toArray();
      let charCount = textChars.size();
      let padCount = 5 - charCount;
      let zeros = Array.tabulate(padCount, func(_) { '0' });
      let paddedChars = zeros.concat(textChars);
      Text.fromArray(paddedChars);
    };

    let paddedSerial = zeroPad(serialString);
    let admissionID = currentYear.toText().concat("0").concat(paddedSerial);

    let candidate : Candidate = {
      fullName;
      fatherName;
      dateOfBirth;
      mobile;
      lastQualification;
      address;
      createdAt = 0;
      admissionID;
      photo;
    };

    candidates.add(admissionID, candidate);
    #ok;
  };

  public query ({ caller }) func getAllCandidates() : async [Candidate] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all candidates");
    };
    candidates.values().toArray().sort();
  };

  public query func getCandidateByMobile(mobile : Text) : async ?Candidate {
    for ((_, candidate) in candidates.entries()) {
      if (candidate.mobile == mobile) {
        return ?candidate;
      };
    };
    null;
  };

  public shared ({ caller }) func addGalleryItem(image : Storage.ExternalBlob, description : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add gallery items");
    };
    let item : GalleryItem = {
      image;
      description;
    };
    gallery.add(description, item);
  };

  public query func getGalleryItems() : async [GalleryItem] {
    gallery.values().toArray();
  };

  public shared ({ caller }) func deleteGalleryItem(description : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete gallery items");
    };
    gallery.remove(description);
  };

  public shared ({ caller }) func createNewsItem(title : Text, content : Text, createdAt : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create news items");
    };
    let newsItem : NewsItem = {
      title;
      content;
      createdAt;
    };
    newsItems.add(title, newsItem);
  };

  public shared ({ caller }) func editNewsItem(title : Text, content : Text, createdAt : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can edit news items");
    };
    let newsItem : NewsItem = {
      title;
      content;
      createdAt;
    };
    newsItems.add(title, newsItem);
  };

  public shared ({ caller }) func deleteNewsItem(title : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete news items");
    };
    newsItems.remove(title);
  };

  public query func getAllNewsItems() : async [NewsItem] {
    newsItems.values().toArray();
  };
};
