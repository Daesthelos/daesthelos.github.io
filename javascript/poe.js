function relativeDamageReduction(armor, rawDamage){ return armor/(armor+10*rawDamage);  }
		function requiredArmorRating(rawDamage, relativeDamageReduced){ return (relativeDamageReduced*10*rawDamage)/(1-relativeDamageReduced); }
		function resultingDamage(armor, rawDamage){ return 10*Math.pow(rawDamage)/(armor+10*rawDamage); }
		function resultingMitigationFlat(armor, rawDamage){ return armor*rawDamage/(armor+10*rawDamage); }
		function defenseFactor(armor, rawDamage){ return (armor)/(10*rawDamage)+1; }

		

		var headers = [
			{"Content-Type":"application/json"},
			{"Accept-Language":"en-us"},
			{"X-Requested-With" : "XMLHttpRequest"},
			//{"Cookie":"POESESSID=99db6e1b992cd7fa5bc717a81a4bd3f7; _ga=GA1.2.1826094589.1540326097; _gat=1; _gid=GA1.2.1255992888.1548013395; __cfduid=d250d4eb6c4f9fffa4621abeb6e38f46c1543432234; stored_data=1"}
		];

		var _POESESSID = "POESESSID=b4f8eff3c8588a48552a96e86b15d8a1"