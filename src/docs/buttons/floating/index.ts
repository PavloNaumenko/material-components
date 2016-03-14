import Component from 'vue-class-component';
import mdButton from '../../../components/button';
import mdIcon from '../../../components/icon';

var template = require('./floating.html');

@Component({
    template: template,
    components: {
        mdButton,
        mdIcon
    }
})
export default class FloatingButtons {
}
