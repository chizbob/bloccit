const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Post", () => {
  beforeEach((done) => {
    this.topic;
    this.post;
    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "Expeditions to Alpha Centauri",
        description: "A compilation of reports from recent visits to the star system."
      })
      .then((topic) => {
        this.topic = topic;
        Post.create({
          title: "Cutest animals",
          body: "Any cute animals",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("#create()", () => {
    it("should create a topic object", (done) => {
      Topic.create({
        title: "Cutest cats",
        description: "Ultimate cat cuteness faved by online crowd"
      })
      .then((topic) => {
        expect(topic.title).toBe("Cutest cats");
        expect(topic.description).toBe("Ultimate cat cuteness faved by online crowd");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a topic with missing title/description", (done) => {
      Topic.create({
        title: "Cutest cats",
        description: "Ultimate cat cuteness faved by online crowd"
      })
      .then((topic) => {
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Topic.title cannot be null");
        expect(err.message).toContain("Topic.description cannot be null");
        done();
      })
    });
  });

  describe("#getPosts()", () => {
    it("should return the associated posts", (done) => {
      this.topic.getPosts()
      .then((posts) => {
        expect(posts[0].title).toBe("Cutest animals");
        done();
      });
    });
  });
});
