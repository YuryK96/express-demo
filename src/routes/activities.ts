import {ActivityViewModel} from "../models/activities/activitieViewModel";
import express, {Express, Request, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types";
import {CreateActivitiesModel} from "../models/activities/createActivitiesModel";
import {ActivitiesQueryModel} from "../models/activities/queryActivitiesModel";
import {UriParamsActivitiesModel} from "../models/activities/uriParamsActivitiesModel";
import {UpdateActivitiesModel} from "../models/activities/updateActivitiesModel";
import {statusCode} from "../statuses/statuses";
import {replaceAllActivities} from "../db/db-activities";

export const BASE_URL_ACTIVITIES = '/api/v1/Activities'
export const getActivitiesViewModel = (activity: ActivityViewModel) => {
    return {
        id: activity.id,
        dueDate: activity.dueDate,
        completed: activity.completed,
        title: activity.title
    }

}


export const getActivitiesRouter = (activities: ActivityViewModel[]) => {
    const router = express.Router()
    router.get('', (req: Request, res: Response<ActivityViewModel[]>) => {
        res.json(activities.map(activity => getActivitiesViewModel(activity)))


    })
    router.post('', (req: RequestWithBody<CreateActivitiesModel>, res: Response<ActivityViewModel>) => {
        // fetch('http://localhost:3000/api/v1/Activities', {method: 'POST', body: JSON.stringify({title: 'skiing', completed: false }), headers: {"content-type" : "application/json"} }).then((res)=> res.json()).then( (res)=> console.log(res) )

        if (!req.body.title) {
            res.sendStatus(statusCode.NOT_FOUND_404)
            return
        }

        const newActivity = {
            id: +new Date(),
            title: req.body.title,
            dueDate: new Date(),
            completed: req.body.completed || false
        }

        activities.push(newActivity);

        res
            .status(statusCode.CREATED_201)
            .json({
                id: newActivity.id,
                title: newActivity.title,
                completed: newActivity.completed,
                dueDate: newActivity.dueDate
            })

    })

    router.get(`/search`, (req: RequestWithParams<ActivitiesQueryModel>, res: Response<ActivityViewModel | null>) => {
        if (req.query.title) {
            const query = req.query.title
            const foundedActivity = activities.find((activity) => activity.title.toLowerCase().indexOf(query.toString().toLowerCase()) > -1)


            if (!foundedActivity) {
                res.sendStatus(statusCode.NOT_FOUND_404)
                return;
            }

            res.json({
                id: foundedActivity.id,
                title: foundedActivity.title,
                completed: foundedActivity.completed,
                dueDate: foundedActivity.dueDate
            })
            return
        }

        res.sendStatus(statusCode.NOT_FOUND_404)
    })

    router.get(`/:id`, (req: Request<UriParamsActivitiesModel>, res: Response<ActivityViewModel>) => {

        const foundedActivity = activities.find((activity) => activity.id === +req.params.id)

        if (!foundedActivity) {
            res.sendStatus(statusCode.NOT_FOUND_404)
            return
        }

        res.json({
            id: foundedActivity.id,
            title: foundedActivity.title,
            completed: foundedActivity.completed,
            dueDate: foundedActivity.dueDate
        })

    })


    router.put(`/:id`, (req: RequestWithParamsAndBody<UriParamsActivitiesModel, UpdateActivitiesModel>, res: Response<ActivityViewModel>) => {
        // fetch('http://localhost:3000/api/v1/Activities/1', {method: 'PUT', body: JSON.stringify({ }), headers: {"content-type" : "application/json"} }).then((res)=> res.json()).then( (res)=> console.log(res) )

        let foundedActivity = activities.find((activity) => activity.id === +req.params.id)

        if (!foundedActivity) {
            res.sendStatus(statusCode.NOT_FOUND_404)
            return
        }
        foundedActivity = {
            ...foundedActivity,
            title: req.body.title || foundedActivity.title,
            completed: req.body.completed || foundedActivity.completed
        }

        for (let i = 0; activities.length > i; i++) {
            if (activities[i].id === foundedActivity.id) {
                activities[i] = foundedActivity;
                break
            }
        }

        res
            .status(statusCode.CREATED_201)
            .json({
                id: foundedActivity.id,
                title: foundedActivity.title,
                completed: foundedActivity.completed,
                dueDate: foundedActivity.dueDate
            })

    })

    router.delete(`/:id`, (req: Request<UriParamsActivitiesModel>, res: Response) => {
        // fetch('http://localhost:3000/api/v1/Activities/1', {method: 'DELETE'}).then((res)=> res.json()).then( (res)=> console.log(res) )
        const newActivities = activities.filter((activity) => activity.id !== +req.params.id)

        if (activities.length === newActivities.length) {
            res.sendStatus(statusCode.NOT_FOUND_404)
            return
        }
        replaceAllActivities(newActivities)
        res.sendStatus(statusCode.NO_CONTENT_204)
    })

    return router
}