import {ActivityViewModel} from "../models/activities/activitieViewModel";
import express, {Express, NextFunction, Request, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types";
import {CreateActivitiesModel} from "../models/activities/createActivitiesModel";
import {ActivitiesQueryModel} from "../models/activities/queryActivitiesModel";
import {UriParamsActivitiesModel} from "../models/activities/uriParamsActivitiesModel";
import {UpdateActivitiesModel} from "../models/activities/updateActivitiesModel";
import {statusCode} from "../statuses/statuses";
import {replaceAllActivities} from "../db/db-activities";
import {activitiesRepository} from "../repositories/activities-repository";
import {handleError} from "../middlewares/input-validation-middleware";
import {body} from "express-validator";

export const BASE_URL_ACTIVITIES = '/api/v1/Activities'
export const getActivitiesViewModel = (activity: ActivityViewModel) => {
    return {
        id: activity.id,
        dueDate: activity.dueDate,
        completed: activity.completed,
        title: activity.title
    }

}


export const getActivitiesRouter = () => {
    const router = express.Router()
    router.get('', (req: Request, res: Response<ActivityViewModel[]>) => {
        const activities = activitiesRepository.getActivities()
        res.json(activities.map(activity => getActivitiesViewModel(activity)))


    })
    router.post('', (req: RequestWithBody<CreateActivitiesModel>, res: Response<ActivityViewModel>) => {
        // fetch('http://localhost:3000/api/v1/Activities', {method: 'POST', body: JSON.stringify({title: 'skiing', completed: false }), headers: {"content-type" : "application/json"} }).then((res)=> res.json()).then( (res)=> console.log(res) )

        if (!req.body.title) {
            res.sendStatus(statusCode.NOT_FOUND_404)
            return
        }
        const newActivity = activitiesRepository.createNewActivity(req.body.title, req.body.completed || false)

        res
            .status(statusCode.CREATED_201)
            .json(getActivitiesViewModel(newActivity))

    })

    router.get(`/search`, (req: RequestWithParams<ActivitiesQueryModel>, res: Response<ActivityViewModel | null>) => {
        if (req.query.title) {
            const query = req.query.title
            const foundedActivity = activitiesRepository.foundedByNameActivity(query)

            if (!foundedActivity) {
                res.sendStatus(statusCode.NOT_FOUND_404)
                return;
            }

            res.json(getActivitiesViewModel(foundedActivity))
            return
        }

        res.sendStatus(statusCode.NOT_FOUND_404)
    })

    router.get(`/:id`, (req: Request<UriParamsActivitiesModel>, res: Response<ActivityViewModel>) => {

        const foundedActivity = activitiesRepository.foundedByIdActivity(+req.params.id)

        if (!foundedActivity) {
            res.sendStatus(statusCode.NOT_FOUND_404)
            return
        }

        res.json(getActivitiesViewModel(foundedActivity))

    })
    6
    const titleValidation = body('title').isLength({
            min: 3,
            max: 10
        })



    router.put(`/:id`, titleValidation, handleError, (req: RequestWithParamsAndBody<UriParamsActivitiesModel, UpdateActivitiesModel>, res: Response<ActivityViewModel>) => {
        // fetch('http://localhost:3000/api/v1/Activities/1', {method: 'PUT', body: JSON.stringify({ }), headers: {"content-type" : "application/json"} }).then((res)=> res.json()).then( (res)=> console.log(res) )

        const changedActivity = activitiesRepository.changeActivity(+req.params.id, req.body.title, req.body.completed)

        if (!changedActivity) {
            res.sendStatus(statusCode.NOT_FOUND_404)
            return
        }

        res
            .status(statusCode.CREATED_201)
            .json(getActivitiesViewModel(changedActivity))

    })

    router.delete(`/:id`, (req: Request<UriParamsActivitiesModel>, res: Response) => {
        // fetch('http://localhost:3000/api/v1/Activities/1', {method: 'DELETE'}).then((res)=> res.json()).then( (res)=> console.log(res) )
        const newActivities = activitiesRepository.deleteActivity(+req.params.id)

        if (!newActivities) {
            res.sendStatus(statusCode.NOT_FOUND_404)
            return
        }
        res.sendStatus(statusCode.NO_CONTENT_204)
    })

    return router
}