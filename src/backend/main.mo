import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Text "mo:core/Text";

import Order "mo:core/Order";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let approvalState = UserApproval.initState(accessControlState);

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action (requests cannot change their own status)");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  public type Id = Text;
  module Id {
    public func compare(id1 : Id, id2 : Id) : Order.Order {
      Text.compare(id1, id2);
    };
  };

  public type Progress = Nat; // progress percentage 0-100
  public type Score = Nat;
  module Score {
    public func compare(score1 : Score, score2 : Score) : Order.Order {
      Nat.compare(score1, score2);
    };
  };

  public type Complete = Bool;
  public type Count = Nat;
  public type Timestamp = Time.Time;

  public type Resource = {
    id : Id;
    title : Text;
    url : Text;
    description : Text;
    resourceType : {
      #article;
      #video;
      #tool;
    };
  };

  module Resource {
    public func compare(resource1 : Resource, resource2 : Resource) : Order.Order {
      Text.compare(resource1.id, resource2.id);
    };
  };

  public type Course = {
    id : Id;
    title : Text;
    description : Text;
    modules : [Text];
    created_at : Timestamp;
    free : Bool;
  };

  module Course {
    public func compare(course1 : Course, course2 : Course) : Order.Order {
      Text.compare(course1.id, course2.id);
    };
  };

  public type Exam = {
    id : Id;
    courseId : Id;
    questions : [Text];
    answers : [Text];
    created_at : Timestamp;
    attempts : Count;
  };

  public type Certification = {
    id : Id;
    userId : Principal;
    courseId : Id;
    issuedAt : Timestamp;
  };

  public type FashionShow = {
    id : Id;
    title : Text;
    description : Text;
    scheduledAt : Timestamp;
    collections : [Text];
  };

  public type VirtualDesign = {
    id : Id;
    userId : Principal;
    title : Text;
    materials : [(Text, Nat)];
    steps : [Text];
    createdAt : Timestamp;
  };

  public type Achievement = {
    id : Id;
    userId : Principal;
    title : Text;
    points : Nat;
    criteria : [Text];
    earnedAt : Timestamp;
  };

  public type CourseProgress = {
    userId : Principal;
    courseId : Id;
    progress : Progress;
    completed : Complete;
    lastUpdated : Timestamp;
  };

  public type UserProfile = {
    name : Text;
    interests : [Text];
    learningPath : [Id];
    userTier : UserTier;
  };

  public type UserTier = { #free; #paid; #premium };
  public type CourseTier = { #free; #paid; #premium };

  public type CoursePurchase = {
    userId : Principal;
    courseId : Id;
    tier : CourseTier;
    purchasedAt : Timestamp;
    paymentStatus : PaymentStatus;
  };

  public type PaymentStatus = { #pending; #completed; #failed };

  public type AIRecommendation = {
    recommendationId : Id;
    reason : Text;
  };

  public type CreateCourseForm = {
    title : Text;
    description : Text;
    modules : [Text];
    tier : CourseTier;
  };

  public type Mentorship = {
    mentorId : Principal;
    menteeId : Principal;
    since : Timestamp;
  };

  public type DiscussionPost = {
    id : Id;
    author : Principal;
    title : Text;
    content : Text;
    createdAt : Timestamp;
    replies : [DiscussionReply];
  };

  public type DiscussionReply = {
    author : Principal;
    content : Text;
    createdAt : Timestamp;
  };

  public type CourseModule = {
    id : Id;
    title : Text;
    description : Text;
    level : CourseLevel;
    isFree : Bool;
    priceTier : ?PriceTier;
    videoUrl : ?Text;
    resources : [Resource];
    supplementalMaterial : [Resource];
    quiz : ?Quiz;
    quizPassingScore : ?Nat;
  };

  public type CourseLevel = { #beginner; #intermediate; #advanced; #professional };
  public type PriceTier = { #free; #paid; #premium };
  public type CourseDescription = {
    id : Id;
    title : Text;
    description : Text;
    modules : [CourseModule];
    created_at : Timestamp;
    isFree : Bool;
    priceTier : ?PriceTier;
  };

  public type CourseModuleInput = {
    title : Text;
    description : Text;
    level : CourseLevel;
    isFree : Bool;
    priceTier : ?PriceTier;
    videoUrl : ?Text;
    resources : [Resource];
    supplementalMaterial : [Resource];
    quiz : ?Quiz;
    quizPassingScore : ?Nat;
  };

  public type CourseInput = {
    title : Text;
    description : Text;
    modules : [CourseModuleInput];
    isFree : Bool;
    priceTier : ?PriceTier;
  };

  public type Quiz = {
    questions : [Text];
    answers : [Text];
  };

  public type FashionFromZeroToProCourse = {
    id : Text;
    title : Text;
    description : Text;
    modules : [CourseModule];
    created_at : Timestamp;
    isFree : Bool;
    priceTier : ?PriceTier;
    beginnerModule : ?CourseModule;
    intermediateModule : ?CourseModule;
    professionalModule : ?CourseModule;
  };

  public type PayPalPaymentStatus = { #pending; #completed; #failed };
  public type PayPalPayment = {
    id : Text;
    userId : Principal;
    courseId : Text;
    status : PayPalPaymentStatus;
    createdAt : Int;
    completedAt : ?Int;
  };

  let courses = Map.empty<Id, Course>();
  let exams = Map.empty<Id, Exam>();
  let certifications = Map.empty<Id, Certification>();
  let fashionShows = Map.empty<Id, FashionShow>();
  let virtualDesigns = Map.empty<Id, VirtualDesign>();
  let achievements = Map.empty<Id, Achievement>();
  let courseProgressMap = Map.empty<Principal, Map.Map<Id, CourseProgress>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let mentorships = Map.empty<Principal, Set.Set<Principal>>();
  let discussions = Map.empty<Id, DiscussionPost>();
  let courseModules = Map.empty<Id, CourseModule>();
  let courseDescriptions = Map.empty<Id, CourseDescription>();
  let stripeSessionOwners = Map.empty<Text, Principal>();
  let coursePurchases = Map.empty<Principal, Map.Map<Id, CoursePurchase>>();
  let paypalPayments = Map.empty<Text, PayPalPayment>();

  let fashionFromZeroToProCourse : FashionFromZeroToProCourse = {
    id = "fashion_from_zero_to_pro";
    title = "Fashion From Zero to Pro";
    description = "Fashion From Zero to Pro is a complete fashion education program designed to take you from absolute beginner to confident fashion professional. It's ideal for those entering fashion with little to no experience, offering step-by-step lessons from foundations to professional career skills.";
    modules = [];
    created_at = Time.now();
    isFree = false;
    priceTier = ?#paid;

    beginnerModule = ?{
      id = "beginner";
      title = "Beginner Level – Fashion Foundations";
      description = "Covers the basics of fashion, styling, fabrics, body types, and colors.";
      level = #beginner;
      isFree = true;
      priceTier = ?#free;
      videoUrl = null;
      resources = [];
      supplementalMaterial = [];
      quiz = null;
      quizPassingScore = null;
    };

    intermediateModule = ?{
      id = "intermediate";
      title = "Intermediate Level – Style & Identity";
      description = "Focuses on developing personal style, understanding trends, and creating a fashion portfolio.";
      level = #intermediate;
      isFree = false;
      priceTier = ?#paid;
      videoUrl = null;
      resources = [];
      supplementalMaterial = [];
      quiz = null;
      quizPassingScore = null;
    };

    professionalModule = ?{
      id = "professional";
      title = "Professional Level – Fashion as a Career";
      description = "Teaches advanced styling, fashion business, collaborations, AI tools, and fashion career paths.";
      level = #professional;
      isFree = false;
      priceTier = ?#premium;
      videoUrl = null;
      resources = [];
      supplementalMaterial = [];
      quiz = null;
      quizPassingScore = null;
    };
  };

  var nextId : Nat = 0;

  func generateId() : Id {
    let id = nextId.toText();
    nextId += 1;
    id;
  };

  // Mentorship System
  public shared ({ caller }) func add_mentorship(mentee : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add mentorships");
    };
    if (not (AccessControl.hasPermission(accessControlState, mentee, #user))) {
      Runtime.trap("Invalid mentee: User must be registered");
    };
    let mentorSet = switch (mentorships.get(caller)) {
      case (null) { Set.empty<Principal>() };
      case (?existing) { existing };
    };
    mentorSet.add(mentee);
    mentorships.add(caller, mentorSet);
  };

  public shared ({ caller }) func create_discussion(title : Text, content : Text) : async DiscussionPost {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create discussions");
    };
    let postId = generateId();
    let post : DiscussionPost = {
      id = postId;
      author = caller;
      title;
      content;
      createdAt = Time.now();
      replies = [];
    };
    discussions.add(Id.compare, postId, post);
    post;
  };

  public shared ({ caller }) func add_discussion_reply(postId : Id, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reply to discussions");
    };
    switch (discussions.get(Id.compare, postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) {
        let reply : DiscussionReply = {
          author = caller;
          content;
          createdAt = Time.now();
        };
        let updatedPost : DiscussionPost = {
          id = post.id;
          author = post.author;
          title = post.title;
          content = post.content;
          createdAt = post.createdAt;
          replies = post.replies.concat([reply]);
        };
        discussions.add(Id.compare, postId, updatedPost);
      };
    };
  };

  public query ({ caller }) func get_discussions() : async [DiscussionPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view discussions");
    };
    discussions.values().toArray();
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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

  public query func get_courses() : async [Course] {
    let coursesArray = courses.values().toArray();
    coursesArray.sort();
  };

  public query ({ caller }) func get_course(courseId : Id) : async ?Course {
    courses.get(Id.compare, courseId);
  };

  public query func get_course_descriptions() : async [CourseDescription] {
    courseDescriptions.values().toArray();
  };

  public query func get_course_modules() : async [CourseModule] {
    courseModules.values().toArray();
  };

  public shared ({ caller }) func create_course(form : CreateCourseForm) : async Course {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create courses");
    };
    let courseId = generateId();
    let course : Course = {
      id = courseId;
      title = form.title;
      description = form.description;
      modules = form.modules;
      created_at = Time.now();
      free = switch (form.tier) {
        case (#free) { true };
        case (#paid) { false };
        case (#premium) { false };
      };
    };
    courses.add(Id.compare, courseId, course);
    course;
  };

  public shared ({ caller }) func update_course(courseId : Id, form : CreateCourseForm) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update courses");
    };
    switch (courses.get(Id.compare, courseId)) {
      case null { Runtime.trap("Course not found") };
      case (?existingCourse) {
        let updatedCourse : Course = {
          id = courseId;
          title = form.title;
          description = form.description;
          modules = form.modules;
          created_at = existingCourse.created_at;
          free = switch (form.tier) {
            case (#free) { true };
            case (#paid) { false };
            case (#premium) { false };
          };
        };
        courses.add(Id.compare, courseId, updatedCourse);
      };
    };
  };

  public shared ({ caller }) func delete_course(courseId : Id) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete courses");
    };
    courses.remove(Id.compare, courseId);
  };

  public shared ({ caller }) func purchase_course(courseId : Id, tier : CourseTier) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can purchase courses");
    };

    switch (courses.get(Id.compare, courseId)) {
      case (null) { Runtime.trap("Course not found") };
      case (?_course) {
        switch (coursePurchases.get(caller)) {
          case (?purchases) {
            if (purchases.containsKey(Id.compare, courseId)) {
              Runtime.trap("Course already purchased");
            };
          };
          case (null) {};
        };
      };
    };

    let coursePurchase : CoursePurchase = {
      userId = caller;
      courseId = courseId;
      tier = tier;
      purchasedAt = Time.now();
      paymentStatus = #pending;
    };
    let userPurchases = switch (coursePurchases.get(caller)) {
      case (null) { Map.empty<Id, CoursePurchase>() };
      case (?purchases) { purchases };
    };
    userPurchases.add(Id.compare, courseId, coursePurchase);
    coursePurchases.add(caller, userPurchases);
  };

  public shared ({ caller }) func update_purchase_status(userId : Principal, courseId : Id, status : PaymentStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update purchase status");
    };

    switch (coursePurchases.get(userId)) {
      case (null) { Runtime.trap("No purchases found for user") };
      case (?purchases) {
        switch (purchases.get(Id.compare, courseId)) {
          case (null) { Runtime.trap("Purchase not found") };
          case (?purchase) {
            let updatedPurchase : CoursePurchase = {
              userId = purchase.userId;
              courseId = purchase.courseId;
              tier = purchase.tier;
              purchasedAt = purchase.purchasedAt;
              paymentStatus = status;
            };
            purchases.add(Id.compare, courseId, updatedPurchase);
          };
        };
      };
    };
  };

  public query ({ caller }) func get_purchased_courses() : async [CoursePurchase] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view purchased courses");
    };
    switch (coursePurchases.get(caller)) {
      case (null) { [] };
      case (?purchases) { purchases.values().toArray() };
    };
  };

  public query ({ caller }) func has_purchased_course(courseId : Id) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check course purchases");
    };
    switch (coursePurchases.get(caller)) {
      case (null) { false };
      case (?purchases) {
        switch (purchases.get(Id.compare, courseId)) {
          case (null) { false };
          case (?purchase) {
            purchase.paymentStatus == #completed;
          };
        };
      };
    };
  };

  public query ({ caller }) func get_my_course_progress(courseId : Id) : async ?CourseProgress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view progress");
    };
    switch (courseProgressMap.get(caller)) {
      case null { null };
      case (?userProgress) {
        userProgress.get(Id.compare, courseId);
      };
    };
  };

  public query ({ caller }) func get_user_course_progress(user : Principal, courseId : Id) : async ?CourseProgress {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own progress");
    };
    switch (courseProgressMap.get(user)) {
      case null { null };
      case (?userProgress) {
        userProgress.get(Id.compare, courseId);
      };
    };
  };

  public shared ({ caller }) func update_course_progress(courseId : Id, progress : Progress) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update progress");
    };

    let hasAccess = switch (courses.get(Id.compare, courseId)) {
      case (null) { false };
      case (?course) {
        if (course.free) {
          true;
        } else {
          switch (coursePurchases.get(caller)) {
            case (null) { false };
            case (?purchases) {
              switch (purchases.get(Id.compare, courseId)) {
                case (null) { false };
                case (?purchase) { purchase.paymentStatus == #completed };
              };
            };
          };
        };
      };
    };

    if (not hasAccess) {
      Runtime.trap("Unauthorized: Must purchase course to track progress");
    };

    let userProgress = switch (courseProgressMap.get(caller)) {
      case null { Map.empty<Id, CourseProgress>() };
      case (?existing) { existing };
    };
    let courseProgress : CourseProgress = {
      userId = caller;
      courseId = courseId;
      progress = progress;
      completed = progress >= 100;
      lastUpdated = Time.now();
    };
    userProgress.add(Id.compare, courseId, courseProgress);
    courseProgressMap.add(caller, userProgress);
  };

  public shared ({ caller }) func create_certification(userId : Principal, courseId : Id) : async Certification {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can issue certifications");
    };
    let certId = generateId();
    let cert : Certification = {
      id = certId;
      userId = userId;
      courseId = courseId;
      issuedAt = Time.now();
    };
    certifications.add(Id.compare, certId, cert);
    cert;
  };

  public query ({ caller }) func get_my_certifications() : async [Certification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view certifications");
    };
    let allCerts = certifications.values().toArray();
    allCerts.filter(func(cert : Certification) : Bool { cert.userId == caller });
  };

  public query ({ caller }) func get_user_certifications(user : Principal) : async [Certification] {
    if (caller != user and not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Can only view your own certifications");
    };
    let allCerts = certifications.values().toArray();
    allCerts.filter(func(cert : Certification) : Bool { cert.userId == user });
  };

  public query func get_fashion_shows() : async [FashionShow] {
    fashionShows.values().toArray();
  };

  public query func get_fashion_show(showId : Id) : async ?FashionShow {
    fashionShows.get(Id.compare, showId);
  };

  public shared ({ caller }) func create_fashion_show(title : Text, description : Text, scheduledAt : Timestamp, collections : [Text]) : async FashionShow {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create fashion shows");
    };
    let showId = generateId();
    let show : FashionShow = {
      id = showId;
      title = title;
      description = description;
      scheduledAt = scheduledAt;
      collections = collections;
    };
    fashionShows.add(Id.compare, showId, show);
    show;
  };

  public shared ({ caller }) func update_fashion_show(showId : Id, title : Text, description : Text, scheduledAt : Timestamp, collections : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update fashion shows");
    };
    let show : FashionShow = {
      id = showId;
      title = title;
      description = description;
      scheduledAt = scheduledAt;
      collections = collections;
    };
    fashionShows.add(Id.compare, showId, show);
  };

  public shared ({ caller }) func delete_fashion_show(showId : Id) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete fashion shows");
    };
    fashionShows.remove(Id.compare, showId);
  };

  public shared ({ caller }) func create_design(title : Text, materials : [(Text, Nat)], steps : [Text]) : async VirtualDesign {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create virtual designs");
    };
    let designId = generateId();
    let design : VirtualDesign = {
      id = designId;
      userId = caller;
      title = title;
      materials = materials;
      steps = steps;
      createdAt = Time.now();
    };
    virtualDesigns.add(Id.compare, designId, design);
    design;
  };

  public query ({ caller }) func get_my_designs() : async [VirtualDesign] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view designs");
    };
    let allDesigns = virtualDesigns.values().toArray();
    allDesigns.filter(func(design : VirtualDesign) : Bool { design.userId == caller });
  };

  public query ({ caller }) func get_design(designId : Id) : async ?VirtualDesign {
    switch (virtualDesigns.get(Id.compare, designId)) {
      case null { null };
      case (?design) {
        if (design.userId == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?design;
        } else {
          Runtime.trap("Unauthorized: Can only view your own designs");
        };
      };
    };
  };

  public shared ({ caller }) func update_design(designId : Id, title : Text, materials : [(Text, Nat)], steps : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update designs");
    };
    switch (virtualDesigns.get(Id.compare, designId)) {
      case null { Runtime.trap("Design not found") };
      case (?existingDesign) {
        if (existingDesign.userId != caller) {
          Runtime.trap("Unauthorized: Can only update your own designs");
        };
        let updatedDesign : VirtualDesign = {
          id = designId;
          userId = caller;
          title = title;
          materials = materials;
          steps = steps;
          createdAt = existingDesign.createdAt;
        };
        virtualDesigns.add(Id.compare, designId, updatedDesign);
      };
    };
  };

  public shared ({ caller }) func delete_design(designId : Id) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete designs");
    };
    switch (virtualDesigns.get(Id.compare, designId)) {
      case null { Runtime.trap("Design not found") };
      case (?design) {
        if (design.userId != caller and not AccessControl.hasPermission(accessControlState, caller, #admin)) {
          Runtime.trap("Unauthorized: Can only delete your own designs");
        };
        virtualDesigns.remove(Id.compare, designId);
      };
    };
  };

  public shared ({ caller }) func create_achievement(title : Text, points : Nat, criteria : [Text]) : async Achievement {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create achievements");
    };
    let achievementId = generateId();
    let achievement : Achievement = {
      id = achievementId;
      userId = caller;
      title = title;
      points = points;
      criteria = criteria;
      earnedAt = Time.now();
    };
    achievements.add(Id.compare, achievementId, achievement);
    achievement;
  };

  public query ({ caller }) func get_my_achievements() : async [Achievement] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view achievements");
    };
    let allAchievements = achievements.values().toArray();
    allAchievements.filter(func(achievement : Achievement) : Bool { achievement.userId == caller });
  };

  public query ({ caller }) func get_user_achievements(user : Principal) : async [Achievement] {
    if (caller != user and not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Can only view your own achievements");
    };
    let allAchievements = achievements.values().toArray();
    allAchievements.filter(
      func(achievement) {
        achievement.userId == user;
      },
    );
  };

  public query ({ caller }) func get_recommendations() : async [AIRecommendation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get recommendations");
    };
    [];
  };

  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check session status");
    };
    switch (stripeSessionOwners.get(Text.compare, sessionId)) {
      case (null) { Runtime.trap("Session not found or unauthorized") };
      case (?owner) {
        if (owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only check your own session status");
        };
      };
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };

    for (item in items.vals()) {
      if (courses.size() == 0) {
        Runtime.trap("Invalid course in checkout items");
      };
    };

    let sessionId = await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
    stripeSessionOwners.add(Text.compare, sessionId, caller);
    sessionId;
  };

  public shared ({ caller }) func confirmCheckoutSession(sessionId : Text, courseId : Id) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can confirm checkout sessions");
    };

    switch (stripeSessionOwners.get(Text.compare, sessionId)) {
      case (null) { Runtime.trap("Session not found or unauthorized") };
      case (?owner) {
        if (owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only confirm your own session");
        };
      };
    };

    switch (courses.get(Id.compare, courseId)) {
      case (null) { Runtime.trap("Course not found") };
      case (?_course) {};
    };

    switch (await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform)) {
      case (#failed { error }) {
        Runtime.trap("Payment failed: " # error);
      };
      case (#completed { response }) {
        let coursePurchase : CoursePurchase = {
          userId = caller;
          courseId = courseId;
          tier = #paid;
          purchasedAt = Time.now();
          paymentStatus = #completed;
        };
        let userPurchases = switch (coursePurchases.get(caller)) {
          case (null) { Map.empty<Id, CoursePurchase>() };
          case (?purchases) { purchases };
        };
        userPurchases.add(Id.compare, courseId, coursePurchase);
        coursePurchases.add(caller, userPurchases);
      };
    };
  };

  public shared ({ caller }) func createPaypalPayment(courseId : Text, sessionId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create PayPal payments");
    };

    switch (courses.get(Text.compare, courseId)) {
      case (null) { Runtime.trap("Course not found") };
      case (?_course) {
        let payment : PayPalPayment = {
          id = sessionId;
          userId = caller;
          courseId = courseId;
          status = #pending;
          createdAt = Time.now();
          completedAt = null;
        };
        paypalPayments.add(Text.compare, sessionId, payment);
      };
    };
  };

  public shared ({ caller }) func confirmPaypalPayment(sessionId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can confirm PayPal payments");
    };

    switch (paypalPayments.get(Text.compare, sessionId)) {
      case (null) { Runtime.trap("Payment not found") };
      case (?payment) {
        if (payment.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only confirm your own payment");
        };

        let coursePurchase : CoursePurchase = {
          userId = payment.userId;
          courseId = payment.courseId;
          tier = #paid;
          purchasedAt = Time.now();
          paymentStatus = #completed;
        };
        let userPurchases = switch (coursePurchases.get(payment.userId)) {
          case (null) { Map.empty<Id, CoursePurchase>() };
          case (?purchases) { purchases };
        };
        userPurchases.add(Id.compare, payment.courseId, coursePurchase);
        coursePurchases.add(payment.userId, userPurchases);

        let updatedPayment : PayPalPayment = {
          id = payment.id;
          userId = payment.userId;
          courseId = payment.courseId;
          status = #completed;
          createdAt = payment.createdAt;
          completedAt = ?Time.now();
        };
        paypalPayments.add(Text.compare, sessionId, updatedPayment);
      };
    };
  };
};
