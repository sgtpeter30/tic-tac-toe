export interface WinningConditions {
  winIndex: number[],
  stripe: StripeModel
}

export interface StripeModel {
  top: string,
  left: string,
  rotate: string,
}