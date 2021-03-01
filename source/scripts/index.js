import {getToast} from "./modules/toast";
import {init as initFeedback} from "./modules/feedback";
import {init as initSlider} from "./modules/slider";

initSlider();
initFeedback( getToast() );
