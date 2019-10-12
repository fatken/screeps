var roleUpgrader = require('role.upgrader');
//var roleBuilder = require('role.builder');

var roleHarvester = {
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

			var primary = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION || 
							structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
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
						return (structure.structureType == STRUCTURE_TOWER //||.structureType == STRUCTURE_CONTAINER
						) && structure.energy < structure.energyCapacity /(3/2);
					}
				});
				if(secondary){
					if(creep.transfer(secondary, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
						creep.moveTo(secondary);
						//creep.say('transfering');
					}
				}
				else {
					roleUpgrader.run(creep);
				}
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
				if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
					creep.moveTo(container);
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
					var energy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
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

module.exports = roleHarvester;