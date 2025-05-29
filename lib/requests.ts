import Cookies from "js-cookie"

export type UserData = {
  email: string
  name: string
  isProfileComplete: boolean
  personalData?: {
    weight: number
    height: number
    age: number
  }
  whoopConnected: boolean
}

export const authService = {
  login: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const userData: UserData = {
      email,
      name: email.split("@")[0],
      isProfileComplete: false,
      personalData: undefined,
      whoopConnected: false,
    }

    Cookies.set("user", JSON.stringify(userData), { expires: 7 })

    return {
      success: true,
      user: userData,
    }
  },

  logout: () => {
    Cookies.remove("user")
  },

  getUser: (): UserData | null => {
    const userStr = Cookies.get("user")
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated: () => {
    return !!Cookies.get("user")
  },

  updatePersonalData: async (data: { weight: number; height: number; age: number }) => {
    const user = authService.getUser()
    if (!user) throw new Error("No user found")

    const updatedUser = {
      ...user,
      personalData: data,
      isProfileComplete: true,
    }

    Cookies.set("user", JSON.stringify(updatedUser), { expires: 7 })
    return updatedUser
  },

  connectWhoop: async () => {
    const user = authService.getUser()
    if (!user) throw new Error("No user found")

    const updatedUser = {
      ...user,
      whoopConnected: true,
    }

    Cookies.set("user", JSON.stringify(updatedUser), { expires: 7 })
    return updatedUser
  },
}
