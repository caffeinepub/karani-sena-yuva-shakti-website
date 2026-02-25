import Map "mo:core/Map";
import List "mo:core/List";
import Blob "mo:core/Blob";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldCandidate = {
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

  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    candidates : Map.Map<Text, OldCandidate>;
    gallery : Map.Map<Text, { image : Storage.ExternalBlob; description : Text }>;
    newsItems : Map.Map<Text, { title : Text; content : Text; createdAt : Nat }>;
    admins : List.List<Principal>;
    superAdmin : ?Principal;
    admissionCounter : Nat;
  };

  type NewCandidate = {
    fullName : Text;
    fatherName : Text;
    dateOfBirth : Text;
    mobile : Text;
    lastQualification : Text;
    address : Text;
    createdAt : Int;
    admissionID : Text;
    photo : ?Storage.ExternalBlob;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    candidates : Map.Map<Text, NewCandidate>;
    gallery : Map.Map<Text, { image : Storage.ExternalBlob; description : Text }>;
    newsItems : Map.Map<Text, { title : Text; content : Text; createdAt : Int }>;
    admins : List.List<Principal>;
    superAdmin : ?Principal;
    admissionCounter : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newCandidates = old.candidates.map<Text, OldCandidate, NewCandidate>(
      func(_id, oldCandidate) {
        { oldCandidate with createdAt = oldCandidate.createdAt };
      }
    );
    let newNewsItems = old.newsItems.map<Text, { title : Text; content : Text; createdAt : Nat }, { title : Text; content : Text; createdAt : Int }>(
      func(_id, item) { { item with createdAt = item.createdAt } }
    );
    {
      old with candidates = newCandidates;
      newsItems = newNewsItems;
    };
  };
};
