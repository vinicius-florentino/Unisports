const Logo = (props) => {
    return (
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="32px"
            height="32px"
            viewBox="0 0 512.000000 512.000000"
            preserveAspectRatio="xMidYMid meet"
            style={{ padding: "8px" }}
            {...props}
        >
            <g
                transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                fill="var(--primary-color)"
                stroke="none"
            >
                <path
                    d="M1300 5105 c-187 -26 -327 -71 -497 -160 -412 -214 -691 -598 -781
                    -1070 -15 -82 -17 -202 -17 -1315 0 -1343 -3 -1276 60 -1495 34 -118 137 -327
                    216 -439 219 -307 559 -522 954 -603 71 -15 216 -17 1255 -20 854 -3 1205 -1
                    1285 7 351 38 667 189 914 439 205 207 345 477 408 786 15 71 17 214 20 1250
                    4 1242 3 1310 -42 1493 -128 524 -539 948 -1055 1087 -204 54 -222 55 -1473
                    54 -887 -1 -1174 -4 -1247 -14z m2309 -1085 c35 -6 77 -18 92 -26 l29 -15 0
                    -1028 c0 -853 -2 -1042 -14 -1103 -57 -290 -240 -518 -519 -648 -381 -177
                    -970 -154 -1322 52 -238 140 -385 325 -456 574 l-23 79 -3 1032 -4 1032 23 15
                    c52 34 127 41 433 41 258 0 308 -2 357 -18 97 -30 88 77 88 -1011 l0 -963 23
                    -34 c51 -75 152 -114 281 -107 96 5 176 41 213 97 l23 34 0 974 0 973 32 20
                    c31 18 115 36 213 44 89 7 468 -3 534 -14z"
                />
            </g>
        </svg>
    );
};

export default Logo;