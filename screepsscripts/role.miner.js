
var roleMiner = {
	run:function(creep){
		let source = Game.getObjectById(creep.memory.srcId);

		let container = source.pos.findInRange(FIND_STRUCTURES, 1, {  //findInRange returns a string
			filter: s=> s.structureType == STRUCTURE_CONTAINER
		})[0];
		if(creep.pos.isEqualTo(container.pos)){
			creep.harvest(source);
		}
		else{
			creep.moveTo(container);
		}
	}
};

module.exports = roleMiner;