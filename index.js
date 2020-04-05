const noble = require("noble-mac");
const OSC = require('osc-js')
const osc = new OSC()

// const client = new Client("127.0.0.1", 6000);
// var server = new Server(6001, "0.0.0.0");

var recieveBuffer = "";

//create the server
const portnumber = 6001;
osc.open({ port : portnumber })

//client
osc.on('*', message => {
  console.log(message.args)
})

var left, center, right;


osc.on('/left', message => {
  console.log(message.args)
  left = message.args;
})

osc.on('/center', message => {
  console.log(message.args)
  center = message.args;
})

osc.on('/right', message => {
  console.log(message.args)
  right = message.args;
})


let message = {
  'left': left,
  'center': center,
  'right': right
};
let msgdata = JSON.stringify(message);



var buffer = "";

var serviceUuids = ["6E400001-B5A3-F393-E0A9-E50E24DCCA9E"];
var allowDuplicates = false;
// testing bluetooth
noble.on("stateChange", function (state) {
  if (state === "poweredOn") {
    noble.startScanning(serviceUuids, allowDuplicates);
  } else {
    noble.stopScanning();
  }
});

noble.on("discover", function (peripheral) {
  console.log(
    "Found device with local name: " + peripheral.advertisement.localName
  );
  console.log(
    "advertising the following service uuid's: " +
      peripheral.advertisement.serviceUuids
  );
  console.log();
  peripheral.connect(function (error) {
    console.log("connected to peripheral: " + peripheral.uuid);
    peripheral.discoverServices(null, function (error, services) {
      console.log("discovered the following services:");
      for (var i in services) {
        console.log("  " + i + " uuid: " + services[i].uuid);
      }
      var deviceInformationService = services[1];
      deviceInformationService.discoverCharacteristics(null, function (
        error,
        characteristics
      ) {
        var readfromargon = characteristics[0];
        var writetoargon = characteristics[1];
        console.log("discovered the following characteristics:");


        for (var i in characteristics) {
          console.log("  " + i + " uuid: " + characteristics[i].uuid);
        }

        // readfromargon.subscribe(function (error, data) {
        //   console.log("reading from argon", data.toString("utf8"));
        // });

        // to start the streaming
        var startStr = "g";
        var startbuf = Buffer.from(startStr, 'utf8');
        writetoargon.write(startbuf,true, function(error){
          console.log(startbuf.toString('utf8'));
          console.log(error)
        });


        for (i = 0; i < 5; i++) {
          //var bufStr = "test";
          var bufStr = msgdata;
          //var buf = new Buffer([0x01]);
          var buf = Buffer.from(bufStr, 'utf8');
          writetoargon.write(buf,true, function(error){
            console.log(buf.toString('utf8'));
            console.log(error)
          });
        }
      });
    });
  });
});

// noble.on('discover', function(peripheral) {

//   peripheral.connect(function(error) {
//     console.log('connected to peripheral: ' + peripheral.uuid);
//     peripheral.discoverServices(['6E400001-B5A3-F393-E0A9-E50E24DCCA9E'], function(error, services) {
//       for (var i in services) {
//         console.log("  " + i + " uuid: " + services[i].uuid);
//       }
//     });
//   });
// });

// //
// noble.on("discover", function(peripheral) {
//   console.log(
//     "Found device with local name: " + peripheral.advertisement.localName
//   );
//   console.log(
//     "advertising the following service uuid's: " +
//       peripheral.advertisement.serviceUuids
//   );
//   peripheral.connect(function(error) {
//     console.log("connected to peripheral: " + peripheral.uuid);
//     peripheral.discoverServices(
//       ["6E400001-B5A3-F393-E0A9-E50E24DCCA9E"],
//       function(error, services) {
//         for (var i in services) {
//           console.log("  " + i + " uuid: " + services[i].uuid);
//         }
//         var deviceInformationService = services[0];
//         console.log("discovered device information service");
//         peripheral.disconnect(function(error) {
//                   console.log('disconnected from peripheral: ' + peripheral.uuid);
//                });
//         // deviceInformationService.discoverCharacteristics(
//         //   ["6E400001-B5A3-F393-E0A9-E50E24DCCA9E"],
//         //   function(error, characteristics) {
//         //     var manufacturerNameCharacteristic = characteristics[0];
//         //   }
//         // );
//       }
//     );
//   });
// });

// noble.on('discover', function(peripheral) {
//   peripheral.connect(function(error) {
//     console.log('connected to peripheral: ' + peripheral.uuid);
//     peripheral.discoverServices(null, function(error, services) {
//       console.log('discovered the following services:');
//       for (var i in services) {
//         console.log('  ' + i + ' uuid: ' + services[i].uuid);
//       }
//       peripheral.disconnect(function(error) {
//         console.log('disconnected from peripheral: ' + peripheral.uuid);
//      });
//     });
//   });
// });
