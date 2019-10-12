var roleUpgrader = require('role.upgrader');
//var roleHarvester = require('role.harvester');
//var roleBuilder = require('role.builder');

var structureThreshold = 0.5;
//var defenseStructureHits = 30000;

var roleRepairer = {
	/**@param {Creep} creep **/
	run:function(creep) {
		if(creep.carry.energy == 0 && creep.memory.working == true){
			creep.memory.working = false;
			//creep.say('harvesting');
		}
		if(creep.carry.energy == creep.carryCapacity && creep.memory.working == false){
			creep.memory.working = true;
			//creep.say('repairing');
		}



		//script for finding closest and build
		if(creep.memory.working){
			var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
				filter: (s)=> (s.structureType != STRUCTURE_WALL &&
							   s.structureType != STRUCTURE_RAMPART)&& s.hits < s.hitsMax * structureThreshold
			});
			//console.log("structure repair needed: " + structure);
			//CONTAINERS DOES NOT BELONG TO ANY PLAYER
			var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				filter: (s)=> s.structureType == STRUCTURE_CONTAINER&& s.hits < s.hitsMax * structureThreshold
			});
			//console.log("container repair needed: " + container);
			

   //          var Container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
   //                  filter: (s) => s.structureType == STRUCTURE_CONTAINER
   //                              //&& s.store[RESOURCE_ENERGY] > 0
   //      	});
			// console.log("container: " + Container);


			if(structure){
				creep.say("repairing");
				if(creep.repair(structure) == ERR_NOT_IN_RANGE){
					creep.moveTo(structure);
				}
			}
			else if (container){
				creep.say("repairing");
				if(creep.repair(container) == ERR_NOT_IN_RANGE){
					creep.moveTo(container);
				}	
			}
			else {
				/*
				var defenseStructure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
					filter: (s)=> (s.structureType == STRUCTURE_WALL ||
								   s.structureType == STRUCTURE_RAMPART)&& s.hits < defenseStructureHits
				});
				if (defenseStructure) {
					if(creep.repair(defenseStructure) == ERR_NOT_IN_RANGE){
						creep.moveTo(defenseStructure);
					}
				}
				else{
					roleUpgrader.run(creep);
				}
				*/
				roleUpgrader.run(creep);

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

module.exports = roleRepairer;