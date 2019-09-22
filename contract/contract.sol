pragma solidity ^0.4.26;
pragma experimental ABIEncoderV2;

contract investContract {
    // 채권 상태
    // 0: 은행이 채권을 팔기 위해 등록하기 전 상태
    // 1: 투자자가 투자금을 제안하는 상태
    // 2: 매입기관이 은행에 구매 신청하는 단계
    // 3: 매입기관이 은행에 구매 신청한 단계
    // 4: 매입기관이 채권을 구매한 상태
    // 5: 매입기관이 금액을 책정하고 게시한 상태
    // 6: 1건 이상의 투자가 성사된 상태
    enum Status {Stored, Suggesting, Applying, Applied, Purchased, Posted, Completed}

    // 회원 종류 (0: 은행, 1: 매입기관, 2: 투자자)
    enum Species {Bank, Agency, Investor}

    // 채권 정보
    struct Bond {
        uint owner;              // 채권자 번호
        uint value;              // 채권의 평가 금액
        uint minValue;           // 채권의 최소 금액
        uint fixedValue;         // 매입 기관의 평가 금액
        uint16 creditorChanges;  // 채권자 변동횟수
        uint16 ownerChanges;     // 소유자 변동횟수
        uint16 mortgageChanges;  // 근저당권 변동횟수
        uint16 pledgeChanges;    // 질권 변동횟수
        Status status;           // 채권 상태
    }
    // 투자 제안 정보
    struct Suggest {
        uint suggester;          // 투자금 제안자
        uint amount;             // 투자 제안금
    }
    // 투자 정보
    struct Invest {
        uint investor;           // 투자자
        uint amount;             // 투자금
        uint rank;               // 선순위
    }

    mapping (uint => Species) private userSpecies;
    mapping (uint => Suggest[]) private suggestList;  // 투자금 제안 리스트
    mapping (uint => Invest[]) private investList;    // 투자 리스트


    Bond[] private bonds;

    // 회원 가입
    function createUser(uint _userId, uint _species) public {
        userSpecies[_userId] = Species(_species);
    }

    // 채권 등록(은행)
    function registerBond(uint _userId, uint _value, uint _minValue) public onlyBank(_userId) {
        bonds.push(Bond(_userId, _value, _minValue, 0, 0, 0, 0, 0, Status.Suggesting));
    }

    // 투자금 제안
    function suggest(uint _bondId, uint _userId, uint _amount) public onlyInvestor(_userId) onlySuggesting(_bondId) {
        suggestList[_bondId].push(Suggest(_userId, _amount));
    }
    
    // 투자금 제안 완료(시간 경과)
    function completedSuggest(uint _bondId) public onlySuggesting(_bondId) {
        bonds[_bondId].status = Status.Applying;
    }

    // 제안 완료된 채권 조회
    function querySuggestedBond(uint _bondId, uint _userId) public view onlyAgency(_userId) onlyApplying(_bondId) returns (Suggest[] memory) {
        return suggestList[_bondId];
    }

    // 매입기관이 은행에게 채권 구매 신청
    function apply(uint _bondId, uint _userId) public onlyAgency(_userId) onlyApplying(_bondId) {
        bonds[_bondId].owner = _userId;
        bonds[_bondId].status = Status.Applied;
    }

    // 은행 - 매입기관 거래
    function txBondBtwBankAndAgency(uint _bankId, uint _bondId, bool _isChecked) public onlyBank(_bankId) onlyApplied(_bondId) {
        if(_isChecked) {
            bonds[_bondId].status = Status.Purchased;
        } else {
            bonds[_bondId].owner = _bankId;
            bonds[_bondId].status = Status.Applying;
        }
    }

    // 투자금 책정(매입기관)
    function bondPriceAndPost(uint _userId, uint _bondId, uint _fixedValue) public onlyAgency(_userId) onlyPurchased(_bondId) {
        bonds[_bondId].fixedValue = _fixedValue;
        bonds[_bondId].status = Status.Posted;
    }

    // 매입기관 - 투자자 거래
    function txBondBtwAgencyAndInvestor(uint _bondId, uint _userId, bool _isChecked) public onlyInvestor(_userId) onlyPosted(_bondId) {
        if(_isChecked) {
            for(uint i=0; i<suggestList[_bondId].length; i++) {
                if(suggestList[_bondId][i].suggester == _userId) {
                    investList[_bondId].push(Invest(_userId, suggestList[_bondId][i].amount, investList[_bondId].length + 1));
                }
            }
        }
    }

    // 매입 기관이 거래 완료 선언
    function txCompleted(uint _bondId, uint _userId) public onlyAgency(_userId) onlyPosted(_bondId) {
        bonds[_bondId].status = Status.Completed;   
    }

    // 채권자 변동횟수 업데이트
    function updateCreditorChangeCount(uint _userId, uint _bondId) public onlyBankOrAgency(_userId) {
        bonds[_bondId].creditorChanges++;
    }

    // 소유자 변동횟수 업데이트
    function updateOwnerChangeCount(uint _userId, uint _bondId) public onlyBankOrAgency(_userId) {
        bonds[_bondId].ownerChanges++;
    }

    // 근저당권 변동횟수 업데이트
    function updateMortgageChangeCount(uint _userId, uint _bondId) public onlyBankOrAgency(_userId) {
        bonds[_bondId].mortgageChanges++;
    }

    // 질권 변동횟수 업데이트
    function updatePledgeChangeCount(uint _userId, uint _bondId) public onlyBankOrAgency(_userId) {
        bonds[_bondId].pledgeChanges++;
    }

    /* Status */
    // Suggesting, Applying, Applied, Purchased, Posted, Completed
    modifier onlySuggesting(uint bondId) { // 1
        require(bonds[bondId].status == Status.Suggesting/*, "This function can only be called when suggesting an investment."*/);
        _;
    }

    modifier onlyApplying(uint bondId) { // 2
        require(bonds[bondId].status == Status.Applying/*, "This function can only be called while the buyer is applying for a bond."*/);
        _;
    }

    modifier onlyApplied(uint bondId) { // 3
        require(bonds[bondId].status == Status.Applied/*, "This function can only be called when the acquirer has applied the purchase of a bond"*/);
        _;
    }

    modifier onlyPurchased(uint bondId) { // 4
        require(bonds[bondId].status == Status.Purchased/*, "This function can only be called when the acquirer has purchased a bond."*/);
        _;
    }

    modifier onlyPosted(uint bondId) { // 5
        require(bonds[bondId].status == Status.Posted/*, "This function can only be called when the acquirer is priced and posted."*/);
        _;
    }

    modifier onlyCompleted(uint bondId) { // 6
        require(bonds[bondId].status == Status.Completed/*, "This function can only be called when one or more investments have been made."*/);
        _;
    }

    /* Species */
    modifier onlyBank(uint userId) {
        require(userSpecies[userId] == Species.Bank/*, "This function can only be called by banks."*/);
        _;
    }

    modifier onlyAgency(uint userId) {
        require(userSpecies[userId] == Species.Agency/*, "This function can only be called by agencies."*/);
        _;
    }

    modifier onlyBankOrAgency(uint userId) {
        if(userSpecies[userId] == Species.Bank || userSpecies[userId] == Species.Agency) {
            _;
        }
        else {
            revert();
        }
    }

    modifier onlyInvestor(uint userId) {
        require(userSpecies[userId] == Species.Investor/*, "This function can only be called by investors."*/);
        _;
    }
}