module.exports = function(){
	StructureSpawn.prototype.createCustomCreep = function(energy, roleName, src, target){
		var numberOfParts = Math.floor(energy / 200);
		var body = [];
		for(let i = 0; i < numberOfParts; i ++){
			body.push(WORK);
		}
		for(let i = 0; i < numberOfParts; i ++){
			body.push(CARRY);
		}
		for(let i = 0; i < numberOfParts; i ++){
			body.push(MOVE);
		}
		return this.createCreep(body, undefined, {role: roleName, working: false,  src:src, target: target});
	};

	StructureSpawn.prototype.createLongDistanceHarvester = function(energy, numberOfWorkParts, home, target, src){
		var numberOfParts = Math.floor(energy / 200);
		var body = [];
		for(let i = 0; i < numberOfWorkParts; i ++){
			body.push(WORK);
		}
		energy -= 150 * numberOfWorkParts;
		var numberOfParts = Math.floor(energy / 100);
		for(let i = 0; i < numberOfParts; i ++){
			body.push(CARRY);
		}
		for(let i = 0; i < numberOfParts + numberOfWorkParts; i ++){
			body.push(MOVE);
		}
		return this.createCreep(body, undefined, {
			role: 'longDistanceHarvester', 
			working: false, 
			home: home, 
			target: target,
			src: src,
			target:target
		});
	};

	StructureSpawn.prototype.createClaimer = function(target){
		return this.createCreep([CLAIM, MOVE], undefined, {role:'claimer', target: target});
	};

	StructureSpawn.prototype.createMiner = function(energy, srcId){
		var body = [];
		if(energy < 700){
			let partGroups = Math.floor(energy/350);
			for(let i = 0; i < partGroups; i ++){
				body.push(WORK);
				body.push(WORK);
				body.push(WORK);
				body.push(MOVE);
			}
		}
		else{
			body = [WORK, WORK, WORK, WORK, WORK,WORK, MOVE, MOVE];
		}
		return this.createCreep(body, undefined, {role:'miner', srcId: srcId});
	};

	StructureSpawn.prototype.createTransporter = function(energy){
        if(energy > 750){
            energy = 750;
        }
		var numberOfParts = Math.floor(energy / 150);
		var body = [];
		for(let i = 0; i < numberOfParts * 2; i ++){
			body.push(CARRY);
		}
		for(let i = 0; i < numberOfParts; i ++){
			body.push(MOVE);
		}
		return this.createCreep(body, undefined, {role: 'transporter', working: false});
	};

	StructureSpawn.prototype.createAttacker = function(energy, home, target, attacking = false, closestWall){
		var numberOfParts = Math.floor(energy / 190);
		var body = [];
		for(let i = 0; i < numberOfParts; i ++){
			body.push(TOUGH);
		}
		for(let i = 0; i < numberOfParts; i ++){
			body.push(MOVE, MOVE);
		}
		for(let i = 0; i < numberOfParts; i ++){
			body.push(ATTACK);
		}
		return this.createCreep(body, undefined, {role:'attacker', target: target, attacking: false, closestWall: closestWall});
	};

	StructureSpawn.prototype.createHealer = function(energy,  home, followingCreep){
		var numberOfParts = Math.floor(energy / 300);
		var body = [];
		for(let i = 0; i < numberOfParts; i ++){
			body.push(MOVE);
		}
		for(let i = 0; i < numberOfParts; i ++){
			body.push(HEAL);
		}
		if (followingCreep) {
			return this.createCreep(body, undefined, {role:'healer', home: home, followingCreep:followingCreep});
		}
		else{
			return this.createCreep(body, undefined, {role:'healer', home: home, followingCreep: 0});	
		}
	};



};