/** CONFIGURATION **/
var useCors = true;

/** usable interface **/
var endpoints = (function(enableCors){
	/* USAGE
	*  
	*	endpoints
	*		- account
	*			- characters
	*			- characterItems
	*			- characterPassives
	*			- stashItems
	*			- mtxStashItems
	*			- forCharacter
	*		- api
	*			- gggInnerStashTabs
	*			- ladders
	*			- leagues
	*			- leagueRules
	*			- publicStashTabs
	*			- seasons
	*			- shop
	*				- mtx
	*					- specials
	*			- trade
	*				- data
	*					-fetch
	*					-ignore
	*					-ignored
	*					-items
	*					-leagues
	*					-search
	*					-static
	*					-unignore
	*		- pvpMatches
	*/
	var root = "https://www.pathofexile.com",
	    cors_service = "https://cors-anywhere.herokuapp.com";


	var cors_root = `${cors_service}/${root}`;

	function Endpoint(baseURL){
		if(!(this instanceof Endpoint)){ throw new Error("Endpoint is must be called with the 'new' keyword."); }
		var rootURL = baseURL;

		this.addRoute = function addRoute(propertyName, route){ this[propertyName] = `${rootURL}/${route}`; }
		this.addRoutes = function(routes){ //using routes.forEach appears to change the scope to window for some reason
			for(var i = 0; i < routes.length; i++){
				this.addRoute(routes[i][0], routes[i][1]);
			}
		}
		this.addNode = function(nodeName, optionalRoute){ 
			var subPath = optionalRoute ? `/${optionalRoute}` : "";
			this[nodeName] = new Endpoint(`${rootURL}${subPath}`);
		}
	}

	var characterWindow = "characterWindow";

	var endpointRoot = (useCors) ? cors_root : root;
	var endpoint = new Endpoint(endpointRoot);

	endpoint.addNode("account", "character-window");
	endpoint.addNode("api","api");
	endpoint.api.addNode("shop","shop");
	endpoint.api.addNode("trade","trade");
	endpoint.api.shop.addNode("mtx", "microtransactions");
	endpoint.api.trade.addNode("data","data");

	endpoint.account.addRoutes([
		["characters", "get-characters"],
		["characterItems", "get-items"],
		["characterPassives", "get-passive-skills"],
		["stashItems", "get-stash-items"],
		["mtxStashItems", "get-mtx-stash-items"],
		["forCharacter", "get-account-name-by-character"]
	]);
	endpoint.api.addRoutes([
		["seasons","seasons"],
		["leagues", "leagues"],
		["leagueRules", "league-rules"],
		["ladders","ladders"],
		["publicStashTabs","public-stash-tabs"],
		["gggInnerStashTabs", "ggg-inner-stash-tabs"], //Unknown if usable/actual endpoint
	]);
	endpoint.api.trade.data.addRoutes([
		["leagues","leagues"],
		["items", "items"],
		["static","static"],
		["search","search"],
		["fetch","fetch"],
		["ignored","ignore"],//Unauthorized? Do you need to be logged in? GET
		["ignore","ignore"],//PUT also unsure how to use this; "api/trade/ignore/{account}"
		["unignore","ignore"],//DELETE see above "api/trade/ignore/{account}"
	]);

	endpoint.api.shop.mtx.addRoute("specials","specials");

	endpoint.addRoute("pvpMatches", "pvp-matches");

	return endpoint;
})(useCors);

