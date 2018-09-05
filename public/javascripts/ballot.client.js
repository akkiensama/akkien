let compiledBallot;

let Ballot;
let ballot;

let tokenPrice;

let owner;
let userData;
let unixStartTime;

let userAccount;

let address = $("#ballot-add").prop("content");

window.addEventListener('load', function() {

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/2ee8969fa00742efb10051fc923552e1"));
    }
    
    this.setInterval(function(){
        if(web3.eth.accounts[0] !== userAccount){
            userAccount = web3.eth.accounts[0];

        }
    }, 100);
    
    
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

        $this = $(this);
        var loadingText = '<i class="fa fa-circle-o-notch fa-spin"></i> Buying Token(s) ...';
        if ($(this).html() !== loadingText) {
            $this.data('original-text', $(this).html());
            $this.html(loadingText);
        }

        let tokenInput = $("#ip-buy-tokens").val();
        let valueInWei = tokenInput * tokenPrice;
        if(isNaN(tokenInput)){
            alert('Wrong type input, please enter number');
        } else {
            ballot.buy.sendTransaction({from: web3.eth.accounts[0], value: valueInWei, gas: '1000000'}, function(err, res){
                if(err){
                    alert(err);
                } else {
                    $this.html($this.data('original-text'));
                }       
            });
        }
    });

    $("#btn-vote").on('click', function(event){
        event.preventDefault();

        $this = $(this);
        var loadingText = '<i class="fa fa-circle-o-notch fa-spin"></i> Voting ...';
        if ($(this).html() !== loadingText) {
            $this.data('original-text', $(this).html());
            $this.html(loadingText);
        }

        let idInput = $("#ip-candidate-id").val();
        if(isNaN(idInput)){
            alert('Wrong type input, please enter number');
        } else {
            ballot.voteForCandidate.sendTransaction( idInput, {from: web3.eth.accounts[0], gas: '1000000'}, function(err, res){
                if(err){
                    alert(err);
                } else {
                    $this.html($this.data('original-text'));
                }  
            });
        }
    });

    $("#btn-ballot-withdraw").on('click', function(event){
        event.preventDefault();

        $this = $(this);
        var loadingText = '<i class="fa fa-circle-o-notch fa-spin"></i> Withdrawing Money...';
        if ($(this).html() !== loadingText) {
            $this.data('original-text', $(this).html());
            $this.html(loadingText);
        }  
       
        ballot.withdraw.sendTransaction({from: web3.eth.accounts[0], gas: '1000000'}, function(err, res){
            if(err){
                alert(err);
            } else {
                $this.html($this.data('original-text'));
            }  
        });
       
    });
}



function getInitData(){

    /// get ballot address
    $("#welcome").text('Welcome to ballot ' + address );
    /// get owner
    ballot.owner.call({from:web3.eth.accounts[0]}, function(err,data){
        owner = data;   
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
        unixStartTime = parseInt(data);
        let startTime = new Date(data * 1000);
        $("#startTime").text(startTime);
    });
    /// get vote time
    ballot.voteTime.call({from:web3.eth.accounts[0]}, function(err,data){
        let unixEndTime = unixStartTime + parseInt(data);
        let endTime = new Date(unixEndTime * 1000);        
        $("#voteTime").text(endTime);
    });

    /// get ballot balance
    ballot.getBalance.call({from:web3.eth.accounts[0]}, function(err, data){
        $('#ballot-balance').text(data);
    });

    /// get ballot status
    ballot.isOpen.call({from:web3.eth.accounts[0]}, function(err, data){
        let text = data?'This ballot is open now':'This ballot is close';
        $('#ballot-status').text(text);
    });

    /// --------------- get voter infor & candidate list -----------------
    ballot.numberCandidates.call({from:web3.eth.accounts[0]}, function(err,number){

        ballot.voterDetails.call(web3.eth.accounts[0], {from:web3.eth.accounts[0]}, function(err,data){
            let text0 = data[0].toString();
            if(text0 == '0' || text0 == '1'){
                text0 += ' token.\n';
            } else {
                text0+= ' tokens.\n';
            }
            $("#token-own").text(text0);

            let text1 = data[1].toString();
            if(text1 == '0' || text1 == '1'){
                text1 += ' token';
            } else {
                text1+= ' tokens';
            }
            $("#token-available").text(text1);

            //-------

            for( let i = 0; i < number; i++){
                let imgSrc = data[2]?(data[2][i]?'tick.png':'cross.png'):'cross.png';


                ballot.candidateList.call( i,{from:web3.eth.accounts[0]}, function(err, Info){
            
                    let hashFromHEx = hex_to_ascii(Info[2].substring(2,) + Info[3].substring(2,30));
                    let imgLink = 'https://gateway.ipfs.io/ipfs/' + hashFromHEx;

                    $("#candidatesTb").append(
                        `<tr>
                            <td><img src=${imgLink} class="avatar rounded-circle" alt="avatar"></td>
                            <td>${Info[0]}</td>
                            <td>${hex_to_ascii(Info[1])}</td>
                            <td>${Info[4]}</td>
                            <td><img src="/images/${imgSrc}" class="isVoted rounded-circle" alt="isVoted"></td>
                        <tr>`  
                    ); 
                });
            }

        });
    });

    setInterval( function(){
        ballot.owner.call({from:web3.eth.accounts[0]}, function(err, data){
            if(owner != web3.eth.accounts[0]){
                $('#ballot-owner').hide();
            } else {
                $('#ballot-owner').show();
            }
        })}, 
        100
    );
}

function hex_to_ascii(str1)
{
	let hex  = str1.toString();
	let str = '';
	for (let n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
}






