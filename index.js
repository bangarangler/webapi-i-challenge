// implement your API here
const express = require("express");

const db = require("./data/db.js");

const server = express();

server.use(express.json());

//server.post("/api/users", (req, res) => {
//const userInfo = req.body;
//console.log("user Info:", userInfo);
//if (!userInfo.name || !userInfo.bio) {
//return res.status(400).json({ message: "Provide name and bio" });
//}
//db.insert(userInfo)
//.then(user => {
//res.status(201).json(user);
//})
//.catch(error => {
//res.status(500).json({ message: "error creating the hub" });
//});
//});

server.post("/api/users", (req, res) => {
  const userInfo = req.body;
  console.log("user info: ", userInfo);
  db.insert(userInfo).then(user => {
    if (!userInfo.name || !userInfo.bio) {
      return res.status(400).json({ message: "Provide name and bio" });
    } else {
      db.insert(userInfo)
        .then(user => {
          res.status(201).json(user);
        })
        .catch(error => {
          res.status(500).json({ message: "error creating the user" });
        });
    }
  });
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  //if(id !== )
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "No User found with that ID" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "The information for that user could not be retieved"
      });
    });
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(user => {
      if (user) {
        res.status(204).json(user);
      } else {
        res
          .status(404)
          .json({ message: "This user with the provided id is not here!" });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "The user could not be removed" });
    });
});

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  if (!req.body.name || !req.body.bio) {
    return res
      .status(400)
      .json({ message: "Provide name and bio to update user" });
  }
  db.update(id, req.body)
    .then(user => {
      if (user) {
        db.findById(id)
          .then(user => {
            res.status(200).json(user);
          })
          .catch(error => {
            res.status(500).json({ error: "something went horribly wrong!" });
          });
        //res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User with that ID dosen't exsist!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "There was an error on the server while trying to update"
      });
    });
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
