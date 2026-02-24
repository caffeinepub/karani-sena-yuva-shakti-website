import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldCandidate = {
    fullName : Text;
    dateOfBirth : Text;
    mobile : Text;
    lastQualification : Text;
    address : Text;
    createdAt : Nat;
    photo : ?Storage.ExternalBlob;
  };

  type OldActor = {
    candidates : Map.Map<Principal, OldCandidate>;
  };

  type NewCandidate = {
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

  type NewActor = {
    candidates : Map.Map<Text, NewCandidate>;
  };

  public func run(old : OldActor) : NewActor {
    let newCandidates = Map.empty<Text, NewCandidate>();
    old.candidates.entries().forEach(
      func(entry) {
        let candidate : NewCandidate = {
          fullName = entry.1.fullName;
          fatherName = "";
          dateOfBirth = entry.1.dateOfBirth;
          mobile = entry.1.mobile;
          lastQualification = entry.1.lastQualification;
          address = entry.1.address;
          createdAt = entry.1.createdAt;
          admissionID = "";
          photo = entry.1.photo;
        };
        newCandidates.add(entry.0.toText(), candidate);
      }
    );
    { candidates = newCandidates };
  };
};
