var compiledBallot;

var Ballot;
var ballot;

var candidates;

var ipfs = window.IpfsApi({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
var Buffer = window.IpfsApi().Buffer;

window.addEventListener('load', function() {

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/2ee8969fa00742efb10051fc923552e1"));
    }
    
    console.log('I am web3', web3);

    // Now you can start your app & access web3 freely:
    startApp();
});


async function startApp() {

    await $.getJSON('../json/BallotFactory.json', function(data) {
        compiledFactory = data; 
    });

    Factory  = web3.eth.contract(JSON.parse(compiledFactory.interface));
    factory = Factory.at('0x2765215c2a36cc0ed390ce57e0b1dbd03bb582b2');

    factory.getDeployedBallots.call({from:web3.eth.accounts[0]}, function(err,deployedBallots){
        var add = '';
        for(var i = 0; i < deployedBallots.length; i++){
            add += '<div class="ballot"><p>' + deployedBallots[i] + '</p>' +
            '<a href="ballot/' + deployedBallots[i] + '">View Details</a></div>';
        }   
        $('#start-ballots').append(add);
    });

///-----------------------------------------------------------------------------------   
    $('#btn-upload').on('click', function(event) {
        event.preventDefault();

        $this = $(this);
        var loadingText = '<i class="fa fa-circle-o-notch fa-spin"></i> Deploying Contract...';
        if ($(this).html() !== loadingText) {
            $this.data('original-text', $(this).html());
            $this.html(loadingText);
        }

        const file = $('#ip-img')[0].files[0];
        Buffer.from(file).then( (fileBuffer) => {
            console.log(fileBuffer);
            ipfs.add(fileBuffer, (err, ipfsHash) => {
                if(err) {
                  console.log('error', err);
                } else {
                  console.log('hash', ipfsHash[0].hash );
    
                  var oldHolder = $('#ip-imgs').prop('placeholder');
                  $('#ip-imgs').prop('placeholder', oldHolder + ',' + ipfsHash[0].hash);
                }
            }); 
        });

     
        
    });


    $('#btn-new-ballot').on('click', function(event) {
        event.preventDefault();

        if(web3.eth.accounts[0]){
            $this = $(this);
            var loadingText = '<i class="fa fa-circle-o-notch fa-spin"></i> Deploying Contract...';
            if ($(this).html() !== loadingText) {
                $this.data('original-text', $(this).html());
                $this.html(loadingText);
            }

            //-----GET INPUT DATA-----------------
            var desc = $("#ip-desc").val();

            var raw_ids = $("#ip-ids").val();
            var ids = raw_ids.split(",");
            var raw_names = $("#ip-names").val();
            var names = raw_names.split(",");
            var raw_imageHashs = $("#ip-imgs").prop("placeholder");
            var imageHashs = raw_imageHashs.split(",");

            var initTokens = $("#ip-initTokens").val();
            var tokenPrice = $("#ip-tokenPrice").val();
            var voteTime = $("#ip-time").val();

            //if(!isNaN(initTokens) || !isNaN(tokenPrice) || !isNaN(voteTime)){
            //    alert('Invalid Input');
            //    $this.html($this.data('original-text'));
            //} else {

            factory.createBallot.sendTransaction( desc, ids, names, ["0x1112", "0x2223"], initTokens, tokenPrice, voteTime, 
                                {from: web3.eth.accounts[0], gas: '3000000', value: web3.toWei('2', 'ether') }, function(err, res){                                       
                                    if(err){
                                        console.log(err);
                                    } else {                                                                                                                                                                    
                                        console.log('create ballot result ', res);
                                    } 
                                    $this.html($this.data('original-text'));
                            });
            //}
        } else {
            alert('Your wallet is not open yet!');
        }

    });
}


