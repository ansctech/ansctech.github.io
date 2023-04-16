import {useSelector} from "react-redux";
import {russian} from "./ru";
import {english} from "./en";

const LNG = ({id}) => {
    const lang = useSelector(state => state.Lang.lang);
    switch (lang?.toUpperCase()) {
        case 'EN':
            return english?.[id] ? english?.[id] : id;
        case "RU":
            return russian?.[id] ? russian?.[id] : id;
        default: return id;
    }
}

export default LNG;