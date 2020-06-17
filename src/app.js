const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", validadeProjectId)

function validadeProjectId(request, response, next){
  const { id } = request.params

  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid project ID.'})
  }
  return next()
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {url, title, techs} = request.body
  const repository = {id: uuid(), url, title, techs, likes: 0}

  repositories.push(repository)

  return response.json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params
  const {title, url, techs} = request.body

  const repositorieIndex = repositories.findIndex(repository => repository.id === id)

  if(repositorieIndex < 0){
    return response.status(400).json({error: "Project not found."})
  }
  const {likes} = repositories[repositorieIndex]
  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositorieIndex] = repository
  
  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params

  const repositorieIndex = repositories.findIndex(repository => repository.id === id)

  if(repositorieIndex < 0){
    return response.status(400).json({error: "Project not found."})
  }
  
  repositories.splice(repositorieIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params

  const repositorieIndex = repositories.findIndex(repository => repository.id === id)

  if(repositorieIndex < 0){
    return response.status(400).json({error: "Project not found."})
  }

  const {likes} = repositories[repositorieIndex]
  const repository = repositories[repositorieIndex]
  repository.likes++
 
  repositories[repositorieIndex] = repository

  return response.json(repository)
});

module.exports = app;
