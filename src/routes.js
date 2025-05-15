import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath} from './utils/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
            handler: (req, res) =>{
              const { search } = req.query

              const tasks = database.select('tasks', search ? {
                title: search,
                description: search,
              } : null)

              return res.end(JSON.stringify(tasks))
        }
},
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
             handler: (req, res) =>{
          const {title, description} = req.body
            
          const task = {
            id: randomUUID(),
            title,
            description,
            completed: null,
            created_at: new Date().toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
            }),
            
        }

        database.insert('tasks', task)
        return res.writeHead(201).end()
    }
},
{
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler : (req, res) =>{
        const { id } = req.params
        const { title, description, completed } = req.body 

        const task = database.select('tasks').find(task => task.id === id);

        if(!task) {
            return res.writeHead(404).end(JSON.stringify({message: 'Tarefa não encontrada!'}))
        }

        database.update('tasks', id, {
            title,
            description,
            completed,
            updated_at: new Date().toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
            }),
        })

        return res.writeHead(204).end()
    }
},
{
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler : (req, res) =>{
        const { id } = req.params
        const task = database.select('tasks').find(task => task.id === id);

        if(!task) {
            return res.writeHead(404).end(JSON.stringify({message: 'Tarefa não encontrada!'}))
        }

        database.update('tasks', id, {
            completed:true,
        })

        database.update('tasks', id, {
            completed: !task.completed,
            updated_at: new Date().toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
            }),
        });

        return res.writeHead(204).end()
    }
},
{
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler : (req, res) =>{
        const { id } = req.params

        database.delete('tasks', id)

        return res.writeHead(204).end()
    }
}
]