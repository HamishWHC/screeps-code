import {handler as genesis} from "./genesis"

export const handlers: TaskHandlers = {
    [TaskType.GENESIS]: genesis
}
