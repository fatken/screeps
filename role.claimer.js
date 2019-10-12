
var roleClaimer = {

	run:function(creep){
		if(creep.room.name == creep.memory.target){
			//console.log(creep.claimController(creep.room.controller));
			if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE){
				creep.moveTo(creep.room.controller);
			}
		}
		else{
			var exit = creep.room.findExitTo(creep.memory.target);
			//creep move to the home room through exit
			creep.moveTo(creep.pos.findClosestByRange(exit));
		}
	}
};

module.exports = roleClaimer;