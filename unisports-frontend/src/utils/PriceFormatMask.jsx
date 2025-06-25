import React from "react";
import PropTypes from "prop-types";
import { NumericFormat } from "react-number-format";

const PriceFormatMask = React.forwardRef(function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            decimalSeparator=","
            thousandSeparator="."
            decimalScale={2}
            fixedDecimalScale
            valueIsNumericString
            prefix="R$"
        />
    );
});

PriceFormatMask.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default PriceFormatMask;
