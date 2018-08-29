var compiledFactory;
var compiledBallot;

var Factory;
var factory;

var Ballot;
var ballot;

var candidates;


window.addEventListener('load', function() {

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/2ee8969fa00742efb10051fc923552e1"));
    }
    
    console.log('I am web3', web3);
    
    var ipfs = window.IpfsApi('ipfs.infura.io', '5001', 'https');

    console.log('I am ipfs', ipfs);
    // Now you can start your app & access web3 freely:
    startApp();
});


function startApp() {
    //initContract();
    $.getJSON('../json/BallotFactory.json', function(data) {
        compiledFactory = data;
        Factory  = web3.eth.contract(JSON.parse(compiledFactory.interface));

        factory = Factory.at('0x4F35bea6557781A34481f5265c2E0181E4F7C435');
    });

///-----------------------------------------------------------------------------------
    var files = [];
    $('#btn-img-add').on('click', function(event) {
        event.preventDefault();
        files.push($("#ip-img")[0].files[0]);

        var listNames = '';
        files.forEach((item) => {
            listNames += item.name + '\n';
        });       

        $("#ip-imgs").val( listNames );
    });

    $('#btn-img-clear').on('click', function(event) {
        event.preventDefault();
        //files =[];
        //listNames = '';
        //$("#ip-imgs").val( listNames );
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(files[0]);
        reader.onloadend = () => convertToBuffer(reader);
    });

    $('#btn-new-ballot').on('click', function(event) {
        event.preventDefault();
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

        //var desc = $("#ip-desc").text();
        var initTokens = $("#ip-initTokens").val();
        var tokenPrice = $("#ip-tokenPrice").val();
        var voteTime = $("#ip-time").val();

        if(!isNaN(initTokens) || !isNaN(tokenPrice) || !isNaN(voteTime)){
            alert('Invalid Input');
            $this.html($this.data('original-text'));
        } else {
            $.getJSON('../json/Ballot.json', function(data) {
                compiledBallot = data;
                Ballot  = web3.eth.contract(JSON.parse(compiledBallot.interface));

                var ballot = Ballot.new(desc, ids, names, ["0x1112", "0x2223"], initTokens, tokenPrice, voteTime, web3.eth.accounts[0], 
                                {from: web3.eth.accounts[0], data: compiledBallot.bytecode, gas: 3000000}, function(err, res){                               
                                    if(err){
                                        console.log(err);
                                        $this.html($this.data('original-text'));
                                    } else {                                   
                                        if(!res.address) {                                       
                                            console.log(res.transactionHash);                               
                                        } else {
                                            $this.html($this.data('original-text'));
                                        }                           
                                    }                                
                                });
            });
        }

    });
}

convertToBuffer = async(reader) => {
    //file is converted to a buffer to prepare for uploading to IPFS
    const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    await ipfs.add(buffer, (err, ipfsHash) => {
        console.log(err, 'hash: ', ipfsHash);
    });
};

//     //getInitData();
    
//     $("#buyForm").submit(function(event){
//         event.preventDefault();

//         var tokenInput = $("#buyTokenInput").val();
//         if(isNaN(tokenInput)){
//             alert('Wrong type input, please enter number');
//         } else {
//             voteInstance.buy.sendTransaction({from: web3.eth.accounts[0], value: tokenInput, gas: '1000000'}, function(){
//                 location.reload(true);
//             });
//         }
//     });

//     $("#voteForm").submit(function(event){
//         event.preventDefault();

//         var idInput = $("#idInput").val();
//         var tokenInput = $("#voteTokenInput").val();
        
//         if(isNaN(idInput) || isNaN(tokenInput)){
//             alert('Wrong type input, please enter number');
//         } else {
//             voteInstance.voteForCandidate.sendTransaction( candidates[idInput], tokenInput, 
//                 {from: web3.eth.accounts[0], gas: '1000000'}, function(){
//                     location.reload(true);
//             });
//         }
//     });
//}



// function getInitData(){
//     ///get user info
//     voteInstance.voterDetails.call(web3.eth.accounts[0], {from:web3.eth.accounts[0]}, function(err, userInfo){
//         $("#userTokens").text('You bought ' + userInfo[0] + ' tokens');

//         /// get candidates infomation
//         voteInstance.allCandidates.call({from:web3.eth.accounts[0]}, function(err,candidateList){           
//             candidates = candidateList;

//             for(let i = 0; i < candidateList.length; i++){          
//                 voteInstance.totalVotesFor.call(candidateList[i], {from:web3.eth.accounts[0]}, function(err,votes){  
//                     $("#candidatesTb").append(
//                         '<tr><td>' + 
//                         i + '</td><td>' + 
//                         candidateList[i] + '</td><td>' + 
//                         votes + '</td><td>' + 
//                         userInfo[1][i] + '</td></tr>'
//                     );              
//                 });
//             }                         
//         });  

//     });    


//     /// get totalTokens
//     voteInstance.totalTokens.call({from:web3.eth.accounts[0]}, function(err,data){        
//         $("#totalTokens").text(data);
//     });
//     /// get balanceTokens
//     voteInstance.balanceTokens.call({from:web3.eth.accounts[0]}, function(err,data){        
//         $("#balanceTokens").text(data);
//     });
//     /// get tokenPrice
//     voteInstance.tokenPrice.call({from:web3.eth.accounts[0]}, function(err,data){       
//         $("#tokenPrice").text(data + ' wei');
//     });
    
//}


function initContract(){ 
    
}





