import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
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

  type AdmissionFormCandidate = {
    fullName : Text;
    dateOfBirth : Text;
    mobile : Text;
    lastQualification : Text;
    address : Text;
    createdAt : Nat;
    photo : ?Storage.ExternalBlob;
  };

  type GalleryItem = {
    image : Storage.ExternalBlob;
    description : Text;
  };

  type NewsItem = {
    title : Text;
    content : Text;
    createdAt : Nat;
  };

  module AdmissionFormCandidate {
    public func compare(candidate1 : AdmissionFormCandidate, candidate2 : AdmissionFormCandidate) : Order.Order {
      Text.compare(candidate1.fullName, candidate2.fullName);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let candidates = Map.empty<Principal, AdmissionFormCandidate>();
  let gallery = Map.empty<Text, GalleryItem>();
  let newsItems = Map.empty<Text, NewsItem>();

  // User profile management
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

  // Admission form management
  public shared ({ caller }) func submitAdmissionForm(
    fullName : Text,
    dateOfBirth : Text,
    mobile : Text,
    lastQualification : Text,
    address : Text,
    photo : ?Storage.ExternalBlob,
  ) : async () {
    let candidate : AdmissionFormCandidate = {
      fullName;
      dateOfBirth;
      mobile;
      lastQualification;
      address;
      createdAt = 0;
      photo;
    };
    candidates.add(caller, candidate);
  };

  public query ({ caller }) func getAllCandidates() : async [AdmissionFormCandidate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all candidates");
    };
    candidates.values().toArray().sort();
  };

  // Gallery management
  public shared ({ caller }) func addGalleryItem(image : Storage.ExternalBlob, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete gallery items");
    };
    gallery.remove(description);
  };

  // News management
  public shared ({ caller }) func createNewsItem(title : Text, content : Text, createdAt : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete news items");
    };
    newsItems.remove(title);
  };

  public query func getAllNewsItems() : async [NewsItem] {
    newsItems.values().toArray();
  };
};
