var compiledBallot;

var Ballot;
var ballot;

var tokenPrice;

var owner;
var userData;

var address = $("#ballot-add").prop("content");

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
    await $.getJSON('../json/Ballot.json', function(data) {
        compiledBallot = data;
    });

    Ballot  = web3.eth.contract(JSON.parse(compiledBallot.interface));
    ballot = Ballot.at(address);

    getInitData();
        
    $("#btn-buy-token").on('click', function(event){
        event.preventDefault();

        var tokenInput = $("#ip-buy-tokens").val();
        var valueInWei = tokenInput * tokenPrice;
        if(isNaN(tokenInput)){
            alert('Wrong type input, please enter number');
        } else {
            ballot.buy.sendTransaction({from: web3.eth.accounts[0], value: valueInWei, gas: '1000000'}, function(){
                //location.reload(true);
            });
        }
    });

    $("#btn-vote").on('click', function(event){
        event.preventDefault();

        var idInput = $("#ip-id").val();
        if(isNaN(idInput)){
            alert('Wrong type input, please enter number');
        } else {
            voteInstance.voteForCandidate.sendTransaction( candidates[idInput], tokenInput, 
                {from: web3.eth.accounts[0], gas: '1000000'}, function(){
                    location.reload(true);
            });
        }
    });
}



function getInitData(){

    /// get ballot address
    $("#welcome").text('Welcome to ballot ' + address );
    /// get owner
    ballot.owner.call({from:web3.eth.accounts[0]}, function(err,data){        
        $("#owner").text(data);
    });
    /// get description
    ballot.description.call({from:web3.eth.accounts[0]}, function(err,data){        
        $("#description").text(data);
    });
    /// get totalTokens
    ballot.totalTokens.call({from:web3.eth.accounts[0]}, function(err,data){        
        $("#totalTokens").text(data);
    });
    /// get balanceTokens
    ballot.balanceTokens.call({from:web3.eth.accounts[0]}, function(err,data){        
        $("#balanceTokens").text(data);
    });
    /// get tokenPrice
    ballot.tokenPrice.call({from:web3.eth.accounts[0]}, function(err,data){ 
        tokenPrice = data;
        $("#tokenPrice").text(data + ' wei');
    });
    /// get start time
    ballot.startTime.call({from:web3.eth.accounts[0]}, function(err,data){        
        $("#startTime").text(data);
    });
    /// get vote time
    ballot.voteTime.call({from:web3.eth.accounts[0]}, function(err,data){        
        $("#voteTime").text(data + ' second');
    });


    /// --------------- get candidate list -----------------
    ballot.numberCandidates.call({from:web3.eth.accounts[0]}, function(err,number){        
        for( var i=0; i< number; i++){
            ballot.candidateList.call( i,{from:web3.eth.accounts[0]}, function(err, Info){
        
                var hashFromHEx = hex_to_ascii(Info[2].substring(2,) + Info[3].substring(2,30));
                var imgLink = 'https://gateway.ipfs.io/ipfs/'.concat(hashFromHEx);
                
                $("#candidatesTb").append(
                    '<tr><td><img src="' + imgLink + '" class="rounded-circle" alt="avatar"></td><td>' +
                    Info[0] + '</td><td>' + 
                    hex_to_ascii(Info[1]) + '</td><td>' +             
                    Info[4] + '</td><tr>'   
                ); 
            });
        }
    });

    /// get user(voter) info
    ballot.voters.call(web3.eth.accounts[0], {from:web3.eth.accounts[0]}, function(err,data){
        var text0 = data[0].toString();
        if(text0 == '0' || text0 == '1'){
            text0 += ' token.\n';
        } else {
            text0+= ' tokens.\n';
        }
        $("#token-own").text(text0);
        var text1 = data[1].toString();
        if(text1 == '0' || text1 == '1'){
            text1 += ' token';
        } else {
            text1+= ' tokens';
        }
        $("#token-available").text(text1);
        console.log('token bought', data[0], '\ntoken avai', data[1], '\ntoken used', data[2]);
    });
}

function hex_to_ascii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }






