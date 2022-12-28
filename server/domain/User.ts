export type User = {
    userId: string
    firstName: string
    lastName: string
    email: string
    emailConfig: UserEmailConfig
    phone: number
    DateOfBirth: string
    address: Address
    occupation: Occupation
    currentBalance: number
    streak: number
    paypalEmail: string
    isInSurvey: boolean
    maritalStatus: MaritalStatus
    completedItems: string[]
    totalReward: number
}

export type MaritalStatus = 'single' | 'married' | 'divorced' | 'living with partner'

export type Address = {
    line1: string
    line2: string
    line3: string
    houseNumber: number
    county: string
    postcode: string
}

export type Occupation = {
    industry: string
    jobTitle: string
    yearsExperience: number
    grossAnnualIncome: number
}

export type UserEmailConfig = {
    address: string
    isEmailVerified: boolean
    verificationCode: string
}