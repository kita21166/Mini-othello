"use strict";
const logArea = {
    Area: document.getElementById(`LogArea`),
    LogOfBlack(content) {
        this.Area.insertAdjacentHTML("afterbegin", `YOU: ${content}(Black); <br>`);
    },
    LogOfWhite(content) {
        this.Area.insertAdjacentHTML("afterbegin", `CALC: ${content}(White); <br>`);
    },
};
const showMap = function () {
    let vec = "";
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            if (PiecesAddress.None.includes(`${j}${i}`)) {
                vec += "0 ";
            } else if (PiecesAddress.Black.includes(`${j}${i}`)) {
                vec += "1 ";
            } else {
                vec += "2 ";
            }
        }
        vec += "\n";
    }
    console.log(vec);
};
const CheckTypeOf = function (objectToCheck, type, where) {
    const Type = type.charAt(0).toUpperCase() + type.slice(1);
    if (Object.prototype.toString.call(objectToCheck) !== `[object ${Type}]`) {
        console.error(`${where}.${objectToCheck} !== [object ${Type}]`);
        return false;
    }
    return true;
};
const FromArrToStr = function (Arr) {
    let Str = ``;
    if (CheckTypeOf(Arr, "Array", "FromArrToStr")) {
        for (let i = 0; i < Arr.length; i++) {
            Str += Arr[i].toString();
        }
        return Str;
    }
    return "99";
};
const FromStrToArr = function (Str) {
    let Arr = [];
    if (CheckTypeOf(Str, "String", "FromStrToArr")) {
        for (let i = 0; i < Str.length; i++) {
            Arr.push(parseInt(Str.charAt(i)));
        }
        return Arr;
    }
    return [9, 9];
};
const ToArr = function MainMethod(Arr, AddOddindex, AddEvenindex) {
    if (CheckTypeOf(Arr, "Array", `ToArr.${AddOddindex}_${AddEvenindex}`)) {
        for (let i = 0; i < Arr.length; i++) {
            if (i % 2 === 1) {
                Arr[i] = Arr[i] + AddOddindex;
            } else {
                Arr[i] += AddEvenindex;
            }
        }
    }
};

const SearchPiecesAre = {
    FromPiece1ToPiece2(Address, FromColorArr, ToColorArr, StopColorArr, IncDec) {
        const AddressXYArr = FromStrToArr(Address);
        const BeToReverse = [];
        for (let i = 0; i < 7; i++) {
            ToArr(AddressXYArr, IncrementOrDecrement[IncDec][0], IncrementOrDecrement[IncDec][1]);
            if (AddressXYArr[0] > 8 || AddressXYArr[1] > 8 || AddressXYArr[0] < 1 || AddressXYArr[1] < 1) {
                BeToReverse.length = 0;
                break;
            }
            const AddressXYStr = FromArrToStr(AddressXYArr);
            if (FromColorArr.indexOf(AddressXYStr) > -1) {
                break;
            }
            if (ToColorArr.indexOf(AddressXYStr) > -1) {
                BeToReverse.push(AddressXYStr);
                continue;
            }
            if (StopColorArr.indexOf(AddressXYStr) > -1) {
                BeToReverse.length = 0;
                break;
            }
        }
        return BeToReverse;
    },
    FromBlackToWhite(Address) {
        const PiecesAreToWhite = [];
        for (let i = 0; i < 8; i++) {
            PiecesAreToWhite.push(...this.FromPiece1ToPiece2(Address, PiecesAddress.White, PiecesAddress.Black, PiecesAddress.None, i));
        }
        return PiecesAreToWhite;
    },
    FromWhiteToBlack(Address) {
        const PiecesAreToBlack = [];
        for (let i = 0; i < 8; i++) {
            PiecesAreToBlack.push(...this.FromPiece1ToPiece2(Address, PiecesAddress.Black, PiecesAddress.White, PiecesAddress.None, i));
        }
        return PiecesAreToBlack;
    },
};
const SearchWhereCanBePut = {
    PivotPiece_AnotherPiece(PivotPieceAddress, FromColorArr, ToColorArr, StopColorArr, IncDec) {
        const AddressXYArr = FromStrToArr(PivotPieceAddress);
        let AreThereBetWeenPiece = 0;
        let AnotherXYStr = "";
        for (let i = 0; i < 7; i++) {
            ToArr(AddressXYArr, IncrementOrDecrement[IncDec][0], IncrementOrDecrement[IncDec][1]);
            if (AddressXYArr[0] > 8 || AddressXYArr[1] > 8 || AddressXYArr[0] < 1 || AddressXYArr[1] < 1) {
                AnotherXYStr = "";
                AreThereBetWeenPiece = 0;
                break;
            }
            const AddressXYStr = FromArrToStr(AddressXYArr);
            if (FromColorArr.indexOf(AddressXYStr) > -1) {
                AreThereBetWeenPiece++;
                continue;
            }
            if (ToColorArr.indexOf(AddressXYStr) > -1) {
                AnotherXYStr = "";
                AreThereBetWeenPiece = 0;
                break;
            }
            if (StopColorArr.indexOf(AddressXYStr) > -1 && AreThereBetWeenPiece) {
                AnotherXYStr = AddressXYStr;
                break;
            }else if(StopColorArr.indexOf(AddressXYStr) > -1){
            	AnotherXYStr = "";
              	AreThereBetWeenPiece = 0;
              	break;
            }
        }
        return [AnotherXYStr, AreThereBetWeenPiece];
    },
    PivotWhitePiece_AnotherBlackPiece() {
        const WhereCanPut = [];
        for (let i = 0; i < PiecesAddress.White.length; i++) {
            for (let j = 0; j < 8; j++) {
                WhereCanPut.push(this.PivotPiece_AnotherPiece(PiecesAddress.White[i], PiecesAddress.Black, PiecesAddress.White, PiecesAddress.None, j));
            }
        }
        let MaxBetweenPiece = 0;
        for (let i = 0; i < WhereCanPut.length; i++) {
            if (WhereCanPut[i][1] > MaxBetweenPiece) {
                MaxBetweenPiece = WhereCanPut[i][1];
            }
        }
        for (let i = 0; i < WhereCanPut.length; i++) {
            if (WhereCanPut[i][1] === MaxBetweenPiece) {
                return WhereCanPut[i][0];
            }
        }
    },
};
const PiecesAddress = {
    Black: ["44", "55"],
    White: ["45", "54"],
    None: [],
    Reverse(fromColorArr, toColorArr, Address) {
        toColorArr.push(...fromColorArr.splice(fromColorArr.indexOf(Address), 1));
    },
    ReverseElementFromNoneToBlack(pieceElement) {
        const Address = pieceElement.id;
        pieceElement.setAttribute("fill", "#000");
        this.Reverse.bind(null, this.None, this.Black, Address)();
    },
    ReverseElementFromWhiteToBlack(pieceElement) {
        const Address = pieceElement.id;
        pieceElement.setAttribute("fill", "#000");
        this.Reverse.bind(null, this.White, this.Black, Address)();
    },
    ReverseElementFromNoneToWhite(pieceElement) {
        const Address = pieceElement.id;
        pieceElement.setAttribute("fill", "#fff");
        this.Reverse.bind(null, this.None, this.White, Address)();
    },
    ReverseElementFromBlackToWhite(pieceElement) {
        console.log(pieceElement);
        const Address = pieceElement.id;
        pieceElement.setAttribute("fill", "#fff");
        this.Reverse.bind(null, this.Black, this.White, Address)();
    },
};
const putWhiteByCalc = function () {
    if (PiecesAddress.Black.length === 0 || PiecesAddress.White.length === 0 || PiecesAddress.None.length === 0) {
        return;
    }
    const SearchWhereTo_PUT_Piece = SearchWhereCanBePut.PivotWhitePiece_AnotherBlackPiece();
    if (SearchWhereTo_PUT_Piece === "") {
        logArea.LogOfWhite("PASS");
        return;
    }
    logArea.LogOfWhite(`${FromNumToABC[parseInt(SearchWhereTo_PUT_Piece.charAt(0)) - 1]}${SearchWhereTo_PUT_Piece.charAt(1)}`);
    const pieceElement = document.getElementById(SearchWhereTo_PUT_Piece);
    PiecesAddress.ReverseElementFromNoneToWhite(pieceElement);
    const PiecesAreToWhite = SearchPiecesAre.FromBlackToWhite(SearchWhereTo_PUT_Piece);
    console.log(PiecesAreToWhite);
    if (PiecesAreToWhite.length === 0) {
        logArea.LogOfWhite("PASS");
    }
    for (let i = 0; i < PiecesAreToWhite.length; i++) {
        if (PiecesAddress.Black.indexOf(PiecesAreToWhite[i]) > -1) {
            PiecesAddress.ReverseElementFromBlackToWhite(document.getElementById(PiecesAreToWhite[i]));
        }
    }
};
const Judge = function () {
    if (PiecesAddress.Black.length === 0) {
        return;
    }
    if (PiecesAddress.White.length === 0) {
        return;
    }
    if (PiecesAddress.None.length > 0) {
        return;
    }
    if (PiecesAddress.Black.length > PiecesAddress.White.length) {
        return;
    }
    if (PiecesAddress.White.length > PiecesAddress.Black.length) {
        return;
    }
    return;
};
window.addEventListener("load", function () {
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            if (!((i === 4 || i === 5) && (j === 4 || j === 5))) {
                document.getElementById(`${i}${j}`).addEventListener("click", putBlackByPlayer);
                PiecesAddress.None.push(`${i}${j}`);
            }
        }
    }
});
const putBlackByPlayer = function () {
    const Address = this.id;
    const PiecesAreToBlack = SearchPiecesAre.FromWhiteToBlack(Address);
    if (PiecesAreToBlack.length === 0) {
        return;
    }
    logArea.LogOfBlack(`${FromNumToABC[parseInt(Address.charAt(0)) - 1]}${Address.charAt(1)}`);
    for (let i = 0; i < PiecesAreToBlack.length; i++) {
        PiecesAddress.ReverseElementFromWhiteToBlack(document.getElementById(PiecesAreToBlack[i]));
    }
    PiecesAddress.ReverseElementFromNoneToBlack(this);
    this.removeEventListener("click", putBlackByPlayer);
    putWhiteByCalc();
    Judge();
    showMap();
};
const FromNumToABC = ["a", "b", "c", "d", "e", "f", "g", "h"];
const PRIORITY = [
    11,
    18,
    81,
    88,
    13,
    14,
    15,
    16,
    31,
    41,
    51,
    61,
    83,
    84,
    85,
    86,
    38,
    48,
    58,
    68,
    23,
    24,
    25,
    26,
    32,
    42,
    52,
    62,
    73,
    74,
    75,
    76,
    37,
    47,
    57,
    67,
    33,
    34,
    35,
    36,
    46,
    56,
    66,
    65,
    64,
    63,
    53,
    43,
    22,
    77,
    72,
    27,
    12,
    21,
    17,
    71,
    82,
    28,
    78,
    87,
];

const IncrementOrDecrement = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
];
