"use strict";

module.exports =
{
  list: list,
  create: create,
  read: read,
  update: update,
  destroy: destroy
}

/** @function lsit
sends a list of all prjects as a JSON array
*/
function list(req, res, db)
{
  db.all("SELECT * FROM pojects", [], function(err, projects)
  {
    if(err)
    {
      console.error(err);
      res.statusCode = 500;
      res.end("Server Error");
    }
    else
    {
      res.setHeader("Content-Type", "text/json");
      res.end(JSON.stringify(projects));
    }
  })
}

/** @function create
creates a new project and adds it to the datbase
*/
function create(req, res, db)
{
  var body = "";

  req.on("error", function(err)
  {
    console.error(err);
    res.statusCode = 500;
    res.end("Server error");
  });

  req.on("data", function(data)
  {
    body+=data;
  });

  req.on("end", function()
  {
    var project = JSON.parse(body);
    db.run("INSERT INTO projects (name, description, version, repository, license) VALUE (?, ?, ?, ?, ?)",
           [project.name, project.description, project.version, project.repository, project.license],
           function(err)
           {
             if(err)
             {
               console.error(err);
               res.statusCode = 500;
               res.end("Could not insert project into database");
               return;
             }
             res.statusCode = 200;
             res.end();
           }
    );
  });
}

/**@function read
serves a specfic project as a json string
*/

function read(req, res, db)
{
  var id = req.params.id;
  db.get("SELECT * FROM projects WHERE id=?", [id], function(err, project)
  {
    if(err)
    {
      console.error(err)
      res.statusCode = 500;
      res.end("Server error");
      return;
    }
    if(!project)
    {
      res.statusCode = 404;
      res.end("Project not found");
      return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/json")
    res.send(JSON.stringify(project));
  });
}

function update(req, res, db)
{
  req.on("error", function(err)
  {
    console.error(err);
    res.statusCode = 500;
    res.end("Server error");
  });

  req.on("data", function(data)
  {
    body+=data;
  });

  req.on("end", function()
  {
    var id = req.params.id;
    db.run("UPDATE projects SET name=?, description=?, version=?, repository=?, license=?, WHERE id=?",
           [project.name, project.description, project.version, project.repository, project.license, project.id],
           function(err)
           {
             if(err)
             {
               console.error(err);
               res.statusCode = 500;
               res.end("Could not update project into database");
               return;
             }
             res.statusCode = 200;
             res.end();
           }
    );
  });
}


function destroy(req, res, db)
{
  var id = req.params.id;
  db.run("DELETE FROM projects WHERE id=?", [id], function(err)
  {
    if(err)
    {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
    }
    res.statusCode = 200;
    res.end();
  });
}
