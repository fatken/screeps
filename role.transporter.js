
var roleTransporter = {
	/**@param {Creep} creep **/
	run:function(creep){
		if(creep.carry.energy == 0 && creep.memory.working == true){
			creep.memory.working = false;
		}
		else if(creep.carry.energy == creep.carryCapacity && creep.memory.working == false){
			creep.memory.working = true;
		}

		if(creep.memory.working){

			//harvester auto repair along the path
			/*
			var repairTargets = creep.pos.findInRange(FIND_STRUCTURES, 1, {
				filter: function(object) {
					return object.hits < object.hitsMax
						&& object.hitsMax - object.hits > REPAIR_POWER;
				}
			});
			repairTargets.sort(function (a,b) {return (a.hits - b.hits)});
			if (repairTargets.length > 0)
				creep.repair(repairTargets[0]);
			*/

	        let adjacentCreeps = creep.pos.findInRange(FIND_MY_CREEPS, 1);
	        if(adjacentCreeps.length > 1){
	        	creep.transfer(adjacentCreeps[1], RESOURCE_ENERGY);
	        }

			var primary = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_SPAWN || 
							structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
				}
			});
			if(primary){
				if(creep.transfer(primary, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
					creep.moveTo(primary);
				}
			}
			else{
				var secondary = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity * 0.66);
					}
				});
				if(secondary){
					if(creep.transfer(secondary, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
						creep.moveTo(secondary);
					}
				}
				else{
					var tertiary = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
						filter: (structure) => {
							return (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)}
					});
					if(tertiary){
						if(creep.transfer(tertiary, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
							creep.moveTo(tertiary);
						}
					}			
				}
			}

		}
		else{
			let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: s => {
					return (s.structureType == STRUCTURE_CONTAINER //|| s.structureType == STRUCTURE_STORAGE
						) && s.store[RESOURCE_ENERGY] > creep.carryCapacity;
				}
			});
			if(container){
				if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
					creep.moveTo(container);
				}
			}
			else{
				var storage = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 0)}
				});
				if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
					creep.moveTo(storage);
				}
				else{
					var energy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
					if(energy){
						if(creep.pickup(energy) == ERR_NOT_IN_RANGE){
							creep.moveTo(energy);
						}
					}
				}
			}
		}
	}

};

module.exports = roleTransporter;