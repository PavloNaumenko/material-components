import Component from 'vue-class-component';
import mdDropdownList from '../../dropdown-list';

import inputMixin from '../../../mixins/input';
import clickAway from '../../../directives/click-away';
import bindBoolean from '../../../directives/bind-boolean';

var Vue: any = Vue || require('vue');

@Component({
    props: {
        value: {
            required: false,
            'default': null
        },
        valueContent: {
            required: false,
            'default': null
        },
        placeholder: {
            required: false,
            'default': null
        },
        name: {
            type: String,
            required: false,
            'default': null,
            twoWay: false
        },
        readonly: {
            type: Boolean,
            required: false,
            'default': null,
            twoWay: false
        },
        debounce: {
            type: Number,
            required: false,
            'default': 0,
            twoWay: false
        },
    },
    events: {
        'select::select': function(value) {
            this.value = value;
            this.close();
            this.valueContent = this.getValueContent()
            this.$broadcast('option::select', value);
            return true;

        },
        'select::unselect': function(value) {
            this.value = value;
            this.valueContent = this.getValueContent()
            this.$broadcast('option::unselect', value);
            return true;
        }
    },
    watch: {
        value: function () {
            this.$nextTick(this.refreshDropdownOptions)
        }
    },
    components: {
        mdDropdownList
    },
    directives: {
        clickAway,
        bindBoolean
    },
    mixins: [
        inputMixin
    ],
    template: require('./autocomplete.html')
})
export default class AutocompleteField {
    private $els: any;
    private $getAllChildren: any;
    private $broadcast: any;
    private _slotContents: any;

    private active: boolean;
    private readonly: boolean;
    private options: any;
    private value: any;
    private valueContent: any;

    data() {
        return {
            active: false,
            options: {}
        }
    }

    compiled() {
        this.refreshOptions()
    }

    ready() {
       this.refreshDropdownOptions()
       this.valueContent = this.getValueContent()
    }

    createOption(option: any) {
        var content = option.content.textContent;
        if(option._scope)
        {
            content = option._scope.$interpolate(content)
        }
        var value = option.value;
        var disabled = option.disabled;

        return {
            content: content,
            value: value,
            disabled: disabled
        };
    }

    getValueContent() {
        return this.options[this.value] ? this.options[this.value].content : '';
    }

    get field() {
        return this.$els.field;
    }

    hasSlot(name = 'default') {
        return name in this._slotContents;
    }

    refreshOptions() {
        var options = this.$getAllChildren().filter((c: any) => {return 'SelectOption' == c.$options.name});
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            var opt: any = this.createOption(option);
            Vue.set(this.options, opt.value, opt);
        }
    }

    refreshDropdownOptions() {
        var options = Array.prototype.slice.call(this.field.options);
        options.forEach((o: HTMLOptionElement) => {
            if (o.selected) {
                this.$broadcast('option::select', o.value)
            }
        });
    }
    open(e) {
        if (!this.active && !this.readonly) {
            this.refreshDropdownOptions();
            this.active = true;
            this.$broadcast('dropdown-list::open', e);
        }
        this.valueContent = ''
    }

    close() {
        if (this.active) {
            this.refreshDropdownOptions();
            this.active = false;
            this.$broadcast('dropdown-list::close');
        }
    }
}