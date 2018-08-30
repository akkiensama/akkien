var compiledBallot;

var Ballot;
var ballot;

var address = $("#ballot-add").prop("content");

var candidates;

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
        
}

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



function getInitData(){
    ///get user info
    // ballot.voterDetails.call(web3.eth.accounts[0], {from:web3.eth.accounts[0]}, function(err, userInfo){
    //     $("#userTokens").text('You bought ' + userInfo[0] + ' tokens');

    //     /// get candidates infomation
    //     ballot.allCandidates.call({from:web3.eth.accounts[0]}, function(err,candidateList){           
    //         candidates = candidateList;

    //         for(let i = 0; i < candidateList.length; i++){          
    //             ballot.totalVotesFor.call(candidateList[i], {from:web3.eth.accounts[0]}, function(err,votes){  
    //                 $("#candidatesTb").append(
    //                     '<tr><td>' + 
    //                     i + '</td><td>' + 
    //                     candidateList[i] + '</td><td>' + 
    //                     votes + '</td><td>' + 
    //                     userInfo[1][i] + '</td></tr>'
    //                 );              
    //             });
    //         }                         
    //     });  

    // });    


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

    ballot.candidateList.call( 0,{from:web3.eth.accounts[0]}, function(err,data){        
        console.log('list', data);
        $("#candidatesTb").append(
            '<tr><td>' + 
            data[0] + '</td><td>' + 
            data[1].substring(0, 30) + '</td><td>' + 
            data[2] + '</td><td>' + 
            data[3] + '</td><td>'
            
        ); 
    });
    
}







