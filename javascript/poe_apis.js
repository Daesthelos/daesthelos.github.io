var api = (function(){
	/*
	* API Documentation aka README
	* See https://app.swaggerhub.com/apis/Chuanhsing/poe/1.0.0 for more information/testing
	* Note: It is out of date/inaccurate in some places; if their testing function seems broken or inaccurate, please lookup the relevant pathofexile.com dev documentation
	*
	* getCharacters(String accountName)
	* - GETs a list for a given account name
	*
	* getCharacterItems(String accountName, String character)
	* - GETs a list of equipment, etc. for a given character belonging to a particular accountName
	*
	* getCharacterPassives(String accountName, String character, bit doShowDetail) (doShowDetail is 0 or 1)
	* - GETs a list of passives for a given character belonging to account name. doShowDetail is a flag that when set to 1 shows detailed passive information
	*
	* getStashItems(String accountName, String league, Number tabIndex, Boolean showDetailedItemInfo)
	* - GETs a list of stash items in the given league for an account.
	*	tabs indicates whether to show item name, position, and colors if true
	*	tabIndex indicates the tab to show out of the list of tabs
	*	requires you to be logged in to use; requires POESESSID in order to work
	*
	* getAccountForCharacter(String characterName)
	* - GETs the account given a particular character name
	*
	* getSeasons()
	* - GETs the list of all previous seasons and their rewards
	*
	* getLeagues(String type, String season, Boolean showCompactInfo, Number limit, Number offset, String callback)
	* - GETs a list of current and past leagues
	*	type: main, event, or season
	*		main : main leagues, as seen from character screen
	*		event: event leagues e.g. ROYALE
	*		season: season leagues e.g. Medallion
	*	season: required when season type is specified; identifies which season to query
	*	showCompactInfo: Show full league info (Max of 50) or display compact information (Max of 230)
	*	limit: Default max is inherited from compact. This setting limits the number of leagues retrieved
	*	offset: Default 0; offsets first included league entry
	*.  callback: jsonp callback
	*
	* getLeague(String name, Boolean includeLadder, Number ladderLimit, Number ladderOffset, Boolean ladderTrack, String callback)
	* - GETs information about a league such as start date, end date, and the path of exile forum post
	*	name : name of the league e.g. Standard
	*	includeLadder : whether or not to include the associated ladder for the league
	*	ladderLimit : Default 20, max 200. If ladder is included, specifies number of ladder entries to include
	*	ladderOffset: Default 0. If ladder is included, offsets first league entry to include
	*	ladderTrack: If ladder is included, adds unique IDs for included character.
	*	callback: jsonp callback
	*
	* getLeagueRules(String callback)
	* - GETs a variety of league rules/modifiers such as private, drops equipped items on death, etc.
	*	callback : jsonp callback
	*
	* getLeagueRule(String id, String callback)
	* - Gets the description for a rule for a given id (Rules have numerical id's associated with them; use getLeagueRules to find them)
	*	id: identifier for the rule, e.g. Hardcore or TurboMonsters
	*	callback: jsonp callback
	*			
	* Official documentation: https://www.pathofexile.com/developer/docs/api-resource-ladders
	* getLadder(Number limit, Number offset, String leagueName, String type, String difficulty, String accountName, Boolean includeCharacterId, String start, String callback)
	* - Gets the ladder for a given league
	*	leagueName : name of the league to be retrieved from
	*	limit : Default 20, Max 200. Number of entries to be included
	*	offset: Default 0. Number by which to offset the first included entry
	*	type : league, pvp, or labyrinth
	*		league: path of exile league e.g. Standard
	*		pvp : Player versus Player
	*		labyrinth : The Labyrinth, used to ascend the players characters
	*	includeCharacterId: if true, adds unique IDs to characters. Implementation-wise, this is a bit. The official documentation is wrong.
	*	accountName : filters characters within the first 15k results for the given account; only applicable for league ladders
	*	difficulty: The difficulty of labyrinth to search. Options: Normal, Cruel, Merciless, and Eternal
	*		Normal : First Labyrinth; iLvl33; requires A1 prison, A2 crypt, A2 chamber of sins lv2, crematorium, catacombs, and Imperial gardens
	*		Cruel : Second Labyrinth; iLvl55; requires A6 prison, A7 Crypt, A7 chamber of sins lv2,
	*		Merciless : Third Labyrinth; iLvl68; requires bathouse, tunnel, ossuary
	*		Eternal : Fourth Labyrinth; iLvl75; requires grinding maps and RNG for 6 RNG trials
	*	start: Timestamp of the desired ladder, labyrinth only.
	*	callback : jsonp callback
	*
	* https://www.pathofexile.com/developer/docs/api-resource-pvp-matches
	* getPVPMatches(String seasonID, String callback)
	* - GETs a list of pvp matches and their times
	* seasonID : Specific season to fetch matches from
	* callback : jsonp callback
	*
	* https://www.pathofexile.com/developer/docs/api-resource-public-stash-tabs
	* getPublicStashTabs(String id)
	* - GETs a list of public stash tabs. The number returned is how many the pathofexile.com backend can fit in a packet
	* id : A string of dash seperated numbers generated from previous public stash tab queries; get them from the next-change-id property
	*
	* https://app.swaggerhub.com/apis/Chuanhsing/poe/1.0.0#/default/get_api_shop_microtransactions_specials 
	* getMTXSpecials(Number limit)
	* - GETs a list of active mtx specials. The documentation states that only active specials are retrievable; seems to be an optional parameter.
	* limit : number of specials to return
	*
	* getTradeLeagues()
	* - GETs a list of ongoing leagues
	*
	* getTradeItems()
	* - GETs a list of items such as equipment, uniques, etc.
	*
	* getTradeStats()
	* - GETs a list of item modifiers
	*
	* getTradeStatic()
	* - GETs a list of items such as currency, maps, etc
	*
	* ** NOT FUNCTIONAL **
	* searchTrade(String league)
	* - POSTs a request against a given league for all trades that fit the given criteria; returns a list of trade IDs and an ID for the request
	* league : name of the league to search against
	*
	* getTrade(String tradeId, String requestId)
	* - GETs item(s) for a given trade
	* tradeId : Id for a trade retrieved from search trade. Honestly not sure how you're supposed to know the significance of ids, probably meant to query all
	* requestId : Id for a given search, provided from the results of searchTrade
	*
	*/

	/**													ACCOUNT INFORMATION																							**/

	function getCharacters(accountName){ return runGETQuery(endpoints.account.characters, { 'accountName' : accountName }); }
	function getCharacterItems(accountName, character){ 
		return runGETQuery(endpoints.account.characterItems,{ 'accountName' : accountName, 'character' : character });
	}
	function getCharacterPassives(accountName, character, doShowDetail){
		return runGETQuery(endpoints.account.characterPassives, { 'accountName' : accountName, 'character' : character, 'reqData' : doShowDetail });
	}
	function getStashItems(accountName, league, tabIndex, showDetailedItemInfo){
		return runGETQuery(endpoints.account.stashItems,
			{ 'league' : league, 'accountName' : accountName,'tabs' : Number(showDetailedItemInfo), 'tabIndex' : tabIndex });
	}
	function getAccountForCharacter(characterName){ return runGETQuery(endpoints.account.forCharacter, { character : characterName }); }


	/**														LEAGUES																									**/

	function getLeague(name, includeLadder, ladderLimit, ladderOffset, ladderTrack, callback){
		return runGETQuery(`${endpoints.api.leagues}/${name}`, 
			{ 'ladder' : Number(includeLadder), 'ladderLimit' : ladderLimit, 'ladderOffset' : ladderOffset, 'ladderTrack' : ladderTrack, 'callback' : callback});
	}
	function getLeagues(type,season,showCompactInfo,limit,offset,callback){
		return runGETQuery(endpoints.api.leagues,
		 {'type' : type, 'season' : season, 'compact' : Number(showCompactInfo), 'limit' : limit, 'offset' : offset, 'callback' : callback});
	}


	/**													 LEAGUE RULES																								**/

	function getLeagueRules(callback){ return runGETQuery(endpoints.api.leagueRules, { 'callback' : callback }); }
	function getLeagueRule(id,callback){ return runGETQuery(`${endpoints.api.leagueRules}/${id}`, { 'callback' : callback}); }


	/**													  TRADE DATA																								**/

	function getTradeLeagues(){ return runGETQuery(endpoints.api.trade.data.leagues); } 
	function getTradeItems(){ return runGETQuery(endpoints.api.trade.data.items); }
	function getTradeStats(){ return runGETQuery(endpoints.api.trade.data.stats); }
	function getTradeStatic(){ return runGETQuery(endpoints.api.trade.data.static); }
	function searchTrade(league){
		function runPOSTQuery(){ return true; }// would need a working ajax posting function
		return runPOSTQuery();
	}
	function getTrade(tradeId, requestId){ return runGETQuery(`${endpoints.api.trade.data.fetch}/${tradeId}`, {"query" : requestId}); }


	/**													 	 MISC																									**/

	function getLadder(realm,  flimit, offset, leagueName, type, difficulty, accountName, includeCharacterId, start, callback){
		return runGETQuery(`${endpoints.api.ladders}/${leagueName}`, 
			{'realm' : realm, 'limit' : limit, 'offset' : offset, 'type' : type, 'track' : Number(includeCharacterId), 'accountName' : accountName, 'difficulty' : difficulty,
			 'start' : start, 'callback' : callback });
	}
	function getMTXSpecials(limit){
		var _type = "active"; //According to the doc, the only type useable; seems optional.
		return runGETQuery(endpoints.api.shop.mtx.specials, {'type' : _type, 'limit' : limit});
	}
	function getPublicStashTabs(id){ return runGETQuery(endpoints.api.publicStashTabs, { 'id': id }); }
	function getPVPMatches(seasonID, callback){
		var _type = "season"; //This does not change, according to the doc
		return runGETQuery(endpoints.pvpMatches, {'type' : _type, 'seasonID' : seasonID, 'callback' : callback});
	}
	function getSeasons(){ return runGETQuery(endpoints.api.seasons); }


	/**												  INTERNAL UTILITIES																							**/

	function convertJSONToQueryString(parameters){
		if(parameters == null){ return ""; }
		var joinedParameters = Object.keys(parameters).map(key => `${key}=${parameters[key]}`).join("&");
		return `?${joinedParameters}`;
	}

	function runGETQuery(endpoint, values){
		var queryString = convertJSONToQueryString(values);
		return ajax.get(`${endpoint}${queryString}`);
	}


	return {
		account : {
			characters : getCharacters,
			character : {
				items : getCharacterItems,
				passives : getCharacterPassives, 
			},
			findByCharacter : getAccountForCharacter,
		},
		ladder : getLadder,
		league : getLeague,
		leagues : getLeagues,
		microtransactions : { 
			specials : getMTXSpecials,
		},
		pvp : {
			matches : getPVPMatches,
		},
		rules : {
			leagues : getLeagueRules,
			league : getLeagueRule,
		},
		seasons: getSeasons,
		stash_tabs : {
			public : getPublicStashTabs,
		},
		trade : {
			leagues : getTradeLeagues,
			items : getTradeItems,
			mods : getTradeStats,
			static : getTradeStatic,
			//search : searchTrade, //Requires POST functionality
			findTradeDetails : getTrade,
		},
		test : function(){ return ajax.get(cors_root); },
	};
})();