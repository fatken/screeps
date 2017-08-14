require('prototype.spawn')();

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
//var roleWallRepairer = require('role.wallRepairer');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');
var roleClaimer = require('role.claimer');
var roleMiner = require('role.miner');
var roleTransporter = require('role.transporter');

var funcTower = require('tower.func');

var HOME = Game.spawns.Spawn1.room.name;
//WARNING WILL NOT WORK WHEN the current home rome has no adjacent rooms
//automation
var roomLeft = HOME.slice(0, 2) + (parseInt(HOME[2]) - 1) + HOME.slice(3, 6);
var roomRight = HOME.slice(0, 2) + (parseInt(HOME[2]) + 1) + HOME.slice(3, 6);
var roomTop = HOME.slice(0, 5) + (parseInt(HOME[5]) - 1);
var roomDown = HOME.slice(0, 5) + (parseInt(HOME[5]) + 1);

/*
var roomTop = 'E72S46';
var roomDown = 'E72S48';
var roomLeft = 'E71S47';
var roomRight = 'E73S47';
*/

//manuallly add a memory to the spawn1 memory
//Game.spawns.Spawn1.memory.claimRoom = 'E73S47';

 //for multi rooming, change these variables, and store them into the memory of spawns
/*
Game.spawns.Spawn1.memory.minHarvesters = 2;
Game.spawns.Spawn1.memory.minUpgraders = 2;
Game.spawns.Spawn1.memory.minBuilders = 1;
Game.spawns.Spawn1.memory.minRepairers = 1;
Game.spawns.Spawn1.memory.minLongDistHarvestersRoomRight = 0;
*/

module.exports.loop = function(){

    for(let spawnName in Game.spawns){
        let spawn = Game.spawns[spawnName];
        let creepsInRoom = spawn.room.find(FIND_MY_CREEPS);
        var name;
        var energy = spawn.room.energyCapacityAvailable;
        
        //setup minimum numbers for different roles
/*
        var minimumNumberOfHarvesters = 2;
        var minimumNumberOfUpgraders = 2;
        var minimumNumberOfBuilders = 1;
        var minimumNumberOfRepairers = 1;
        var minimumNumberOfWallRepairers = 0;
        var minimumNumberOfLongDistanceHarvestersRoomTop = 0;
        var minimumNumberOfLongDistanceHarvestersRoomDown = 0;
        var minimumNumberOfLongDistanceHarvestersRoomLeft = 0;
        var minimumNumberOfLongDistanceHarvestersRoomRight = 0;
        
        Game.spawns.Spawn1.memory.minHarvesters, minUpgraders, minBuilders, minRepairers, minWallRepairers, ...
*/

        //count the total amount of harvesters in a room
        var numberOfHarvesters = _.sum(creepsInRoom, (creep) => creep.memory.role == 'harvester');
        var numberOfBuilders = _.sum(creepsInRoom, (creep) => creep.memory.role == 'builder');
        var numberOfUpgraders = _.sum(creepsInRoom, (creep) => creep.memory.role == 'upgrader');
        var numberOfRepairers = _.sum(creepsInRoom, (creep) => creep.memory.role == 'repairer');
        var numberOfMiners = _.sum(creepsInRoom, (creep) => creep.memory.role == 'miner');
        var numberOfTransporters = _.sum(creepsInRoom, (creep) => creep.memory.role == 'transporter');

    //  var numberOfWallRepairers = _.sum(Game.creeps, (creep) => creep.memory.role == 'wallRepairer');
    //  var numberOfLongDistanceHarvestersRoomTop = _.sum(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == roomTop);
    //  var numberOfLongDistanceHarvestersRoomDown = _.sum(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == roomDown);
    //  var numberOfLongDistanceHarvestersRoomLeft = _.sum(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == roomLeft);
        var numberOfLongDistanceHarvestersRoomRight = _.sum(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == roomRight);

        //ultimate situation with no harvesting mechanism existing
        //if there is no harvesters or either miners or transporters
        if(numberOfHarvesters == 0 && (numberOfMiners == 0 || numberOfTransporters == 0)){
            //spawn proper size creep with


            //if there are miners, meaning there are extractor mining, so check for spawning transporters
            if(numberOfMiners > 0){
                name = spawn.createTransporter(energy);
            }
            //else, there is not extractor mining, only default harvester
            else{
                if(numberOfHarvesters < spawn.memory.minHarvesters){
                    if(energy > 1000){
                        energy = 1000;
                    }
                    name = spawn.createCustomCreep(energy, 'harvester');
                }
            }
        }
        //
        else{
            let sources = spawn.room.find(FIND_SOURCES);
            for(let source of sources){
                if(!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.srcId == source.id)){
                    let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: s => s.structureType == STRUCTURE_CONTAINER
                    });
                    if(container){
                        name = spawn.createMiner(source.id);
                        break;
                    }
                }
            }
        }
//

        /*
        if(spawn == Game.spawns.Spawn2){
            console.log(numberOfHarvesters);
            console.log(spawn.memory.minHarvesters);
        }
        */

        //testing
        /*
        var source0 = Game.spawns.Spawn1.room.find(FIND_SOURCES)[0];
        //console.log(source0);
        let test = source0.pos.isNearTo(FIND_STRUCTURES, {
            filter: s=> s.structureType == STRUCTURE_CONTAINER
        });
        //console.log(test);
        var container0 = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        });
        console.log(container0 == test);
*/
        //

        if(name == undefined){
            //set up automatically spawning new harvester when the amount is below minimum
            if(numberOfHarvesters < spawn.memory.minHarvesters){
                name = spawn.createCustomCreep(energy, 'harvester', 0);
            }
            //spawn transporters
            if(numberOfTransporters < spawn.memory.minTransporters){
                name = spawn.createTransporter(energy);
            }
            else if(numberOfUpgraders < spawn.memory.minUpgraders){
                if(spawn == Game.spawns.Spawn2){
                    name = spawn.createCustomCreep(energy, 'upgrader', 0);
                }
                else{
                    name = spawn.createCustomCreep(energy, 'upgrader', 1);
                }
            }
            else if(numberOfRepairers < spawn.memory.minRepairers){
                name = spawn.createCustomCreep(energy, 'repairer', 0);
            }
            else if(numberOfBuilders < spawn.memory.minBuilders){
                name = spawn.createCustomCreep(energy, 'builder', 0);
            }
            else if(spawn.memory.claimRoom){ // != undefined
                name = spawn.createClaimer(spawn.memory.claimRoom);
                if (!(name < 0)){
                    delete spawn.memory.claimRoom;
                }
            }
            else if(numberOfLongDistanceHarvestersRoomRight < spawn.memory.minLDHRoomRight){
                name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 4, spawn.room.name, roomRight, 2);
            }
            /*
            else if(numberOfWallRepairers < minimumNumberOfWallRepairers){
                name = Game.spawns.Spawn1.createCustomCreep(energy, 'wallRepairer', 0);
            }
            
            else if(numberOfLongDistanceHarvestersRoomTop < minimumNumberOfLongDistanceHarvestersRoomTop){
                name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 4, spawn.room.name, roomTop, 0);
            }
            else if(numberOfLongDistanceHarvestersRoomDown < minimumNumberOfLongDistanceHarvestersRoomDown){
                name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 4, spawn.room.name, roomDown, 0);
            }
            else if(numberOfLongDistanceHarvestersRoomLeft < minimumNumberOfLongDistanceHarvestersRoomLeft){
                name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 4, spawn.room.name, roomLeft, 0);
            }
            */
        }

        if(!(name < 0) && name != undefined){
            console.log(spawnName + ' spawned ' + Game.creeps[name].memory.role + ' ' + name);
            console.log('Harvesters    :' + numberOfHarvesters);
            console.log('Upgraders     :' + numberOfUpgraders);
            console.log('Builders      :' + numberOfBuilders);
            console.log('Repairers     :' + numberOfRepairers);
            console.log('Miners        :' + numberOfMiners);
            console.log('Transporters  :' + numberOfTransporters);
        }

        //For all towers, run tower function
        var towers = spawn.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        for (let tower of towers){
    		//var tower = towers[name];
    		funcTower.run(tower);
    	}

        //setup creep to run different role scripts
        for (let name in Game.creeps){
            var creep = Game.creeps[name];

            if(creep.ticksToLive <= 10){
                creep.moveTo(spawn);
            }
            //auto renew creep when the creep is near spawn
            if(creep.pos.isNearTo(spawn) && creep.ticksToLive < 1460){
                spawn.renewCreep(creep);
            }
            if(creep.memory.role == 'harvester'){
                roleHarvester.run(creep);
            }
            else if(creep.memory.role == 'upgrader'){
                roleUpgrader.run(creep);
            }
            else if(creep.memory.role == 'builder'){
                roleBuilder.run(creep);
            }
            else if(creep.memory.role == 'repairer'){
                roleRepairer.run(creep);
            }
            else if(creep.memory.role == 'longDistanceHarvester'){
                roleLongDistanceHarvester.run(creep);
            }
            else if(creep.memory.role == 'claimer'){
                roleClaimer.run(creep);
            }
            else if(creep.memory.role == 'miner'){
                roleMiner.run(creep);
            }
            else if(creep.memory.role == 'transporter'){
                roleTransporter.run(creep);
            }
            /*
            else if(creep.memory.role == 'wallRepairer'){
                roleWallRepairer.run(creep);
            }
            */
        }

        //clear memory of dead creep to avoid memory overflow when spawning new creep with same name
        for (let name in Memory.creeps){
        	if(!Game.creeps[name]){
        		delete Memory.creeps[name];
        	}
        }
    }
}