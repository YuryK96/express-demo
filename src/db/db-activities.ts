import {ActivityViewModel} from "../models/activities/activitieViewModel";


export let activities: ActivityViewModel[] = [
    {
        id: 0,
        title: 'Jumping',
        dueDate: new Date(),
        completed: true
    },
    {
        id: 1,
        title: 'Jogging',
        dueDate: new Date(),
        completed: true,
    },
    {
        id: 2,
        title: 'Walking',
        dueDate: new Date(),
        completed: false
    }]

export const  replaceAllActivities = (newActivities: ActivityViewModel[])=> {
    activities = newActivities
}