import {activities, replaceAllActivities} from "../db/db-activities";
import {ActivityViewModel} from "../models/activities/activitieViewModel";


export const activitiesRepository = {
    getActivities(): ActivityViewModel[] {
        return activities
    },
    createNewActivity(title: string, completed: boolean): ActivityViewModel {
        const newActivity = {
            id: +new Date(),
            title: title,
            dueDate: new Date(),
            completed: completed || false
        }
        activities.push(newActivity);
        return newActivity
    },
    foundedByNameActivity(name: string): ActivityViewModel | undefined {
        return activities.find((activity) => activity.title.toLowerCase().indexOf(name.toString().toLowerCase()) > -1)
    },
    foundedByIdActivity(id: number) {
        return activities.find((activity) => activity.id === id)
    },
    changeActivity(id: number, title: string | undefined, completed: boolean | undefined): ActivityViewModel | undefined {

        let foundedActivity: ActivityViewModel | undefined = this.foundedByIdActivity(id)

        if (foundedActivity) {
            foundedActivity = {
                ...foundedActivity,
                title: title || foundedActivity.title, completed: completed || foundedActivity.completed
            }
            for (let i = 0; activities.length > i; i++) {
                if (activities[i].id === foundedActivity.id) {
                    activities[i] = foundedActivity;
                    break
                }
            }

        }
        return foundedActivity
    },
    deleteActivity(id: number): ActivityViewModel[] | undefined {
        const newActivities = activities.filter((activity) => activity.id !== id)
        if (activities.length === newActivities.length) {
            return undefined
        }
        replaceAllActivities(newActivities)
        return newActivities
    }
}