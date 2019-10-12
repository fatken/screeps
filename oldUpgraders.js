//var roleBuilder = require('role.builder');

var roleUpgrader = {
	run: function(creep){

		// generate a cummulative array from a normal array
		function cummulative(array){
			var cummulativeArray = [];
			cummulativeArray.push(array[0]);
			for(i = 1; i < array.length; i++){
				cummulativeArray.push(array[i] + cummulativeArray[i-1])
			}
			return(cummulativeArray);
		}

		//generate an index, based on a cummulative array, with probability proportional to the value in the cummulative array
		function proportionalIndexGen(cummulativeArray){
			var arrayLength = cummulativeArray.length;
			var randomNumber = Math.random()*cummulativeArray[cummulativeArray.length-1];
			for(i = 0; i < arrayLength; i++){
				if(randomNumber < cummulativeArray[i]){
					return i;
				}
			}
		}

		// find all resource structures in range
		let resourceStructures = creep.pos.findInRange(FIND_STRUCTURES, 50, {
			filter: s => {
				return (s.structureType == STRUCTURE_CONTAINER || 
						 s.structureType == STRUCTURE_STORAGE)
			&& s.store[RESOURCE_ENERGY] > creep.carryCapacity
			}
		})
		for(i = 0; i < resourceStructures.length; i++){
		}

		// find all dropped resources in range
        var droppedResources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 50);
		for(i = 0; i < droppedResources.length; i++){
        }

		let resourcesAmount = []
		// extract resources amount from above instances
        //structure
        for(i = 0; i < resourceStructures.length; i++){
			resourcesAmount.push(resourceStructures[i].store[RESOURCE_ENERGY]);
        }
        //dropped energy
		for(i = 0; i < droppedResources.length; i++){
			resourcesAmount.push(droppedResources[i].energy);
        }
		// if there is a valid source
		if(resourcesAmount.length != 0){
			// generate cummulative array
			var cummulativeArray = cummulative(resourcesAmount);
			
			//select an index from cummulative array, with probability proportional to the values			
			let resourceIndex = proportionalIndexGen(cummulativeArray);
			// combine two arrays of different objects to 1 array
			var combinedResourcesList = resourceStructures.concat(droppedResources);
			var resource = combinedResourcesList[resourceIndex];
		}
		// if tehre is no resources lying around, extract resources by itself.
		else{
			let energySources = creep.pos.findInRange(FIND_SOURCES_ACTIVE, 50);
			let resourcesAmount = []
			let lenEnergySources = energySources.length;

			for(i = 0; i < lenEnergySources; i++){
				resourcesAmount.push(energySources[i].energy);
			}
			let cummulativeArray = cummulative(resourcesAmount);
			let resourceIndex = proportionalIndexGen(cummulativeArray);
			var resource = energySources[resourceIndex];
		}
		console.log(typeof resource);
		console.log(resource);
		console.log(resource.pos);
		if(resource.structureType){
			console.log("a container or storage");
		}else if(resource.amount){
			console.log("dropped resource");
		}else if(resource.energy){
			console.log("energy source")
		}
		














		if(creep.carry.energy == 0 && creep.memory.working == true){
			creep.memory.working = false;
			//creep.say('harvesting');
		}
		if(creep.carry.energy == creep.carryCapacity && creep.memory.working == false){
			creep.memory.working = true;
			//creep.say('upgrading');
		}
		
		if(creep.memory.working){
			//roleBuilder.run(creep);
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
				creep.moveTo(creep.room.controller);
			}
		}
		else {
			let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: s => {
					return (s.structureType == STRUCTURE_CONTAINER || 
							 s.structureType == STRUCTURE_STORAGE)
				&& s.store[RESOURCE_ENERGY] > creep.carryCapacity
				}
			});
			if (container){
				creep.say("move");
				/* pathfinding and tracking the paths */

				if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
					// if creep has the path
					if(creep.memory.resourcePath){
						let resourcePath = creep.memory.resourcePath;

						let moved = creep.move(resourcePath[0].direction);
						if(moved == 0){
							resourcePath.shift();
						}
						if(creep.memory.resourcePath.length == 1){
							delete creep.memory.resourcePath;
						}

					}
					else{
						creep.memory.resourcePath = creep.pos.findPathTo(container);
						//console.log(creep.memory.resourcePath);
					}
					//creep.memory.resourcePath = creep.pos.findPathTo(container);


					//creep.moveTo(container);
				}
			}
			else {
				let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
				if (source){
					if (creep.harvest(source) == ERR_NOT_IN_RANGE){
						creep.moveTo(source);
					}
				}
				else {
					var energy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
					if (energy){
						if (creep.pickup(energy) == ERR_NOT_IN_RANGE){
							creep.moveTo(energy);
						}
					}
					else {
						creep.memory.working = true;
					}
				}
			}
		}
	}
};

module.exports = roleUpgrader;