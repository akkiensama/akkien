let compiledBallot;

let Ballot;
let ballot;

let owner;

const ipfs = window.IpfsApi({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
const Buffer = window.IpfsApi().Buffer;

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
    factory = Factory.at('0x1bB423fF71608a539c42932FfEf37f1d3fB4b1D4');

    getInitData();

    
///----------------------------------------------------------------------------------- 
    /// Button  upload image to ipfs
    $('#btn-upload').on('click', function(event) {
        event.preventDefault();

        $this = $(this);
        let loadingText = '<i class="fa fa-circle-o-notch fa-spin"></i> Uploading Image ...';
        if ($(this).html() !== loadingText) {
            $this.data('original-text', $(this).html());
            $this.html(loadingText);
        }

        const file = $('#ip-img')[0].files[0];

        let reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => convertAndUpload(reader);
        
    });


    /// Button Clear Image Hash List
    $('#clear-hash').on('click', function(event) {
        event.preventDefault();

        $('#ip-imgs').val('');
    });


    /// Button Create New Ballot
    $('#btn-new-ballot').on('click', function(event) {
        event.preventDefault();

        if(web3.eth.accounts[0]){
            $this = $(this);
            let loadingText = '<i class="fa fa-circle-o-notch fa-spin"></i> Deploying Contract...';
            if ($(this).html() !== loadingText) {
                $this.data('original-text', $(this).html());
                $this.html(loadingText);
            }

            //-----GET INPUT DATA-----------------
            let desc = $("#ip-desc").val();

            let raw_ids = $("#ip-ids").val();
            let ids = raw_ids.split(",");
            let raw_names = $("#ip-names").val();
            let names = raw_names.split(",");

            let raw_imageHashs = $("#ip-imgs").val();
            let imageHashs = raw_imageHashs.split(",");
            let imgHashHeads = [];
            let imgHashTails = [];
            for(let i = 0; i < imageHashs.length; i++){
                imgHashHeads.push(imageHashs[i].substring(0, 32));
                imgHashTails.push(imageHashs[i].substring(32, 46));
            }

            let initTokens = $("#ip-initTokens").val();
            let tokenPrice = $("#ip-tokenPrice").val();
            let voteTime = $("#ip-time").val();

            if(isNaN(initTokens) || isNaN(tokenPrice) || isNaN(voteTime)){
               alert('Invalid Input');
               $this.html($this.data('original-text'));
            } else {
                factory.createBallot.sendTransaction( desc, ids, names, imgHashHeads, imgHashTails, initTokens, tokenPrice, voteTime, 
                                    {from: web3.eth.accounts[0], gas: '3000000', value: web3.toWei('2', 'ether') }, function(err, res){                                       
                                        if(err){
                                            console.log(err);
                                        } else {                                                                                                                                                                    
                                            console.log('create ballot result ', res);
                                        } 
                                        $this.html($this.data('original-text'));
                                });
            }
        } else {
            alert('Your wallet is not open yet!');
        }

    });

    $("#btn-factory-withdraw").on('click', function(event){
        event.preventDefault();

        $this = $(this);
        let loadingText = '<i class="fa fa-circle-o-notch fa-spin"></i> Withdrawing Money...';
        if ($(this).html() !== loadingText) {
            $this.data('original-text', $(this).html());
            $this.html(loadingText);
        }  
       
        factory.withdraw.sendTransaction({from: web3.eth.accounts[0], gas: '1000000'}, function(err, res){
            if(err){
                alert(err);
            } else {
                $this.html($this.data('original-text'));
            }  
        });
       
    });
}

//-- HELPER FUNCTION -----------------
function getInitData(){
    
    factory.owner.call({from:web3.eth.accounts[0]}, function(err, data){
        owner = data;
    });

    factory.getBalance.call({from:web3.eth.accounts[0]}, function(err, data){
        let dataInEther  = web3.fromWei(data, 'ether');
        $('#factory-balance').text(dataInEther);
    });

    factory.costPerBallot.call({from:web3.eth.accounts[0]}, function(err, data){
        let dataInEther  = web3.fromWei(data, 'ether');
        $('#factory-cost').text(dataInEther);
    });

    factory.getDeployedBallots.call({from:web3.eth.accounts[0]}, function(err,deployedBallots){
        let add = '';
        for(let i = 0; i < deployedBallots.length; i++){
            add += `<div class="ballot">
                        <p>${deployedBallots[i]}</p>
                        <a href="ballot/${deployedBallots[i]}">View Details</a>
                    </div>`;
        }   
        $('#start-ballots').append(add);
    });

    setInterval( function(){
        factory.owner.call({from:web3.eth.accounts[0]}, function(err, data){
            if(owner != web3.eth.accounts[0]){
                $('#factory-owner').hide();
            } else {
                $('#factory-owner').show();
            }
        })}, 
        100
    );
}


convertAndUpload = async(reader) => {
    const buffer = await Buffer.from(reader.result);
    
    ipfs.add(buffer, (err, ipfsHash) => {
        if(err){
            alert(err);
        } else {
            let oldVal = $('#ip-imgs').val();
            let newVal = oldVal + (oldVal == ''? ipfsHash[0].hash : ',' + ipfsHash[0].hash);

            $('#ip-imgs').val(newVal);
        }

        $this.html($this.data('original-text'));
    });
};

