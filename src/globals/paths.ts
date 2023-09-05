const DatabaseBasePath = "sqlite://db"

export const DatabasePaths = {
	GameImages: DatabaseBasePath + "/gameimages.sqlite",
	LivestreamPresences: DatabaseBasePath + "/presences.sqlite",
	RolesCategories: DatabaseBasePath + "/roles-categories.sqlite",
	Twitch: DatabaseBasePath + "/twitchtokens.sqlite",
	Roles: DatabaseBasePath + "/roles.sqlite",
}