import Map "mo:core/Map";
import Array "mo:core/Array";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Category = {
    #tech;
    #sports;
    #politics;
    #business;
    #entertainment;
  };

  module Category {
    public func toText(category : Category) : Text {
      switch (category) {
        case (#tech) { "Tech" };
        case (#sports) { "Sports" };
        case (#politics) { "Politics" };
        case (#business) { "Business" };
        case (#entertainment) { "Entertainment" };
      };
    };
  };

  type Article = {
    id : Nat;
    title : Text;
    summary : Text;
    category : Category;
    imageUrl : Text;
    duration : Nat;
  };

  module Article {
    public func compare(a1 : Article, a2 : Article) : Order.Order {
      Nat.compare(a1.id, a2.id);
    };
  };

  type Earning = {
    articleId : Nat;
    title : Text;
    coins : Nat;
    timestamp : Int;
  };

  type Withdrawal = {
    id : Nat;
    accountNumber : Text;
    ifscCode : Text;
    coins : Nat;
    status : Text;
    timestamp : Int;
  };

  module Withdrawal {
    public func compare(w1 : Withdrawal, w2 : Withdrawal) : Order.Order {
      Int.compare(w1.timestamp, w2.timestamp);
    };
  };

  type Wallet = {
    balance : Nat;
    totalEarned : Nat;
    inrValue : Float;
    readArticles : Set.Set<Nat>;
  };

  type Profile = {
    name : Text;
    wallet : Wallet;
    earningsHistory : List.List<Earning>;
    withdrawals : List.List<Withdrawal>;
    totalCoinsEarned : Nat;
  };

  module Profile {
    public func compare(p1 : Profile, p2 : Profile) : Order.Order {
      Nat.compare(p2.totalCoinsEarned, p1.totalCoinsEarned);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let articles = Map.empty<Nat, Article>();
  let userProfiles = Map.empty<Principal, Profile>();
  let userProfilesSimple = Map.empty<Principal, UserProfile>();
  var withdrawalCounter = 0;

  // Initialize sample articles
  let sampleArticles = [
    {
      id = 1;
      title = "AI Revolutionizes Tech Industry";
      summary = "Artificial Intelligence is driving innovation across the tech industry, with new applications emerging daily...";
      category = #tech;
      imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba027...001";
      duration = 12;
    },
    {
      id = 2;
      title = "Blockchain Transforming Finance";
      summary = "Blockchain technology is changing the financial sector, offering enhanced security and transparency...";
      category = #tech;
      imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba027...002";
      duration = 13;
    },
    {
      id = 3;
      title = "Startups Drive Tech Economy";
      summary = "Innovative startups are fueling the tech economy, introducing new products and services...";
      category = #tech;
      imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba027...003";
      duration = 11;
    },
    {
      id = 4;
      title = "Soccer World Cup Highlights";
      summary = "The latest Soccer World Cup provided unforgettable moments as teams vied for the championship...";
      category = #sports;
      imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba027...004";
      duration = 14;
    },
    {
      id = 5;
      title = "Olympic Games Records Broken";
      summary = "Athletes set new world records at the recent Olympic Games, showcasing incredible talent...";
      category = #sports;
      imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba027...005";
      duration = 13;
    },
    {
      id = 6;
      title = "Cricket World Cup";
      summary = "Exciting matches and outstanding performances made the Cricket World Cup a global spectacle...";
      category = #sports;
      imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba027...006";
      duration = 12;
    },
    {
      id = 7;
      title = "Election Results Announced";
      summary = "Recent election results have been announced, influencing the political landscape significantly...";
      category = #politics;
      imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba027...007";
      duration = 13;
    },
    {
      id = 8;
      title = "New Policy Regulations";
      summary = "Government introduces new policy regulations aimed at improving social welfare...";
      category = #politics;
      imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba027...008";
      duration = 12;
    },
    {
      id = 9;
      title = "Global Political Summit";
      summary = "Leaders gather at the Global Political Summit to discuss international relations and cooperation...";
      category = #politics;
      imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba027...009";
      duration = 14;
    },
    {
      id = 10;
      title = "Stock Market Hits Record Highs";
      summary = "The stock market continues to climb, reaching new record highs and attracting investors...";
      category = #business;
      imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba027...010";
      duration = 13;
    },
    {
      id = 11;
      title = "Entrepreneurs Launch Startups";
      summary = "A surge in entrepreneurship is seeing more startups being launched in various industries...";
      category = #business;
      imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba027...011";
      duration = 12;
    },
    {
      id = 12;
      title = "Global Economic Outlook";
      summary = "Experts share the global economic outlook, focusing on growth and market trends...";
      category = #business;
      imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba027...012";
      duration = 14;
    },
    {
      id = 13;
      title = "Top 10 Movies of the Year";
      summary = "This year's top movies have captured audiences' hearts and set box office records...";
      category = #entertainment;
      imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba027...013";
      duration = 12;
    },
    {
      id = 14;
      title = "Superstar Launches Debut Album";
      summary = "A new superstar's debut album is making waves in the entertainment industry...";
      category = #entertainment;
      imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba027...014";
      duration = 13;
    },
    {
      id = 15;
      title = "Celebrity Chef Opens Restaurant";
      summary = "A renowned celebrity chef has opened a new restaurant, attracting food enthusiasts...";
      category = #entertainment;
      imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba027...015";
      duration = 14;
    },
  ];

  // Add sample articles to store
  for (article in sampleArticles.values()) {
    articles.add(article.id, article);
  };

  // Helper function to ensure user profile exists
  func getOrCreateUserProfile(caller : Principal) : Profile {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) {
        let newProfile : Profile = {
          name = "User" # caller.toText();
          wallet = {
            balance = 0;
            totalEarned = 0;
            inrValue = 0.0;
            readArticles = Set.empty<Nat>();
          };
          earningsHistory = List.empty<Earning>();
          withdrawals = List.empty<Withdrawal>();
          totalCoinsEarned = 0;
        };
        userProfiles.add(caller, newProfile);
        newProfile;
      };
    };
  };

  // Required user profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfilesSimple.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfilesSimple.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfilesSimple.add(caller, profile);
  };

  // Public endpoint - accessible to everyone including guests
  public query func getArticles() : async [Article] {
    articles.values().toArray().sort();
  };

  // User-only endpoint - requires authentication
  public shared ({ caller }) func recordArticleRead(articleId : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can earn coins");
    };

    let profile = getOrCreateUserProfile(caller);

    if (profile.wallet.readArticles.contains(articleId)) {
      Runtime.trap("Article already read");
    };

    switch (articles.get(articleId)) {
      case (null) { Runtime.trap("Article not found") };
      case (?article) {
        let updatedBalance = profile.wallet.balance + 50;
        let updatedTotalEarned = profile.wallet.totalEarned + 50;
        let updatedInrValue = (updatedBalance.toFloat() * 3.0) / 100.0;

        let newEarning : Earning = {
          articleId = article.id;
          title = article.title;
          coins = 50;
          timestamp = Time.now();
        };

        profile.wallet.readArticles.add(articleId);

        let updatedProfile : Profile = {
          name = profile.name;
          wallet = {
            balance = updatedBalance;
            totalEarned = updatedTotalEarned;
            inrValue = updatedInrValue;
            readArticles = profile.wallet.readArticles;
          };
          earningsHistory = profile.earningsHistory;
          withdrawals = profile.withdrawals;
          totalCoinsEarned = profile.totalCoinsEarned + 50;
        };

        updatedProfile.earningsHistory.add(newEarning);
        userProfiles.add(caller, updatedProfile);
        updatedBalance;
      };
    };
  };

  // User-only endpoint - requires authentication
  public query ({ caller }) func getWallet() : async {
    balance : Nat;
    totalEarned : Nat;
    inrValue : Float;
    readArticles : [Nat];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wallet");
    };

    let profile = getOrCreateUserProfile(caller);
    {
      balance = profile.wallet.balance;
      totalEarned = profile.wallet.totalEarned;
      inrValue = profile.wallet.inrValue;
      readArticles = profile.wallet.readArticles.toArray();
    };
  };

  // User-only endpoint - requires authentication
  public query ({ caller }) func getEarningsHistory() : async [Earning] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view earnings history");
    };

    let profile = getOrCreateUserProfile(caller);
    profile.earningsHistory.toArray();
  };

  // User-only endpoint - requires authentication
  public shared ({ caller }) func submitWithdrawal(accountNumber : Text, ifscCode : Text, coinAmount : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit withdrawals");
    };

    let profile = getOrCreateUserProfile(caller);

    if (profile.wallet.balance < coinAmount) {
      Runtime.trap("Insufficient balance");
    };

    let updatedBalance = profile.wallet.balance - coinAmount;
    let updatedInrValue = (updatedBalance.toFloat() * 3.0) / 100.0;

    // Instant credited status
    let newWithdrawal : Withdrawal = {
      id = withdrawalCounter;
      accountNumber;
      ifscCode;
      coins = coinAmount;
      status = "Credited";
      timestamp = Time.now();
    };

    withdrawalCounter += 1;

    let updatedProfile : Profile = {
      name = profile.name;
      wallet = {
        balance = updatedBalance;
        totalEarned = profile.wallet.totalEarned;
        inrValue = updatedInrValue;
        readArticles = profile.wallet.readArticles;
      };
      earningsHistory = profile.earningsHistory;
      withdrawals = profile.withdrawals;
      totalCoinsEarned = profile.totalCoinsEarned;
    };

    updatedProfile.withdrawals.add(newWithdrawal);
    userProfiles.add(caller, updatedProfile);
    true;
  };

  // User-only endpoint - requires authentication
  public query ({ caller }) func getWithdrawals() : async [Withdrawal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view withdrawals");
    };

    let profile = getOrCreateUserProfile(caller);
    profile.withdrawals.toArray().sort();
  };

  // Public endpoint - accessible to everyone including guests
  public query func getLeaderboard() : async [LeaderboardEntry] {
    let allProfiles = userProfiles.values().toArray().sort();
    let topProfiles = allProfiles.sliceToArray(0, Nat.min(10, allProfiles.size()));
    topProfiles.map(
      func(profile) {
        {
          name = profile.name;
          totalCoinsEarned = profile.totalCoinsEarned;
        };
      }
    );
  };

  type LeaderboardEntry = {
    name : Text;
    totalCoinsEarned : Nat;
  };
};
