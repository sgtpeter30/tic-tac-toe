import { CurrentGameModel } from "./current-game.model"
import { SettingsModel } from "./settings.model"

export interface MindModel {
  currentGame: CurrentGameModel,
  settings: SettingsModel
}