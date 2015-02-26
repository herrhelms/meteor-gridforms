UI.registerHelper('gridForm', function () {
   return Template._gridForm;
});

UI.registerHelper('gridSet', function () {
   _.defaults(this, { classes: '' });
   this.classlist = 'grid-form-fieldset ' + this.classes;
   this.labelhtml = Spacebars.SafeString( this.label );
   return Template._gridFormFieldset;
});

UI.registerHelper('gridRow', function () {
   _.defaults(this, {  span: 1, classes: '' });
   this.classlist = 'grid-form-row ' + this.classes;
   return Template._gridRow;
});

UI.registerHelper('gridElement', function(){
   _.defaults(this, { span: 1, classes: '' });
   if(this.disabled) this.classes += ' grid-form-disabled no-hover';
   this.classlist = _.clean('grid-form-element ' + this.classes);
   switch(this.type) {
      case 'text':
         return Template._gridElement;
      case 'textarea':
         _.defaults(this, { rows: 3 });
         return Template._gridElementTextArea;
      case 'email':
         return Template._gridElementEmail;
      case 'date':
         _.defaults(this, { format: 'yyyy-mm-dd', step: 1 });
         return Template._gridElementDate;
      case 'number':
         _.defaults(this, { step: 1 });
         return Template._gridElementNumber;
      case 'checkbox':
         return Template._gridElementCheckbox;
      case 'radio':
         _.defaults(this, { name: 'radio' });
         return Template._gridElementRadio;
      case 'submit':
         _.defaults(this, { value: 'Submit' });
         return Template._gridElementSubmit;
      default:
         return Template._gridElementCustom;
   }
});

var validateEmail = function(str) {
   var lastAtPos = str.lastIndexOf('@');
   var lastDotPos = str.lastIndexOf('.');
   if(lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2) {
      return true;
   }
   console.log('Validation error - Email address ('+str+') seems incorrect.');
   return false;
};

var validateDate = function(str,format) {
   var mom = moment(str,format);
   if(mom.isValid() && str  === mom.format(format)) return true;
   console.log('Validation error - Date format ('+format+') incorrect. ' + mom.format(format) + ' != '  +str);
   return false;
};

Template._gridElementDate.events({
   'focusout input': function(evt,tpl) {
      var val = $(evt.currentTarget).val();
      var format = $(evt.currentTarget).attr('format').toUpperCase();
      if(val.length > 0) {
         if(validateDate(val,format)) {
            $(evt.currentTarget).parent().removeClass('grid-form-error');
         } else {
            $(evt.currentTarget).parent().addClass('grid-form-error');
         }
      } else {
         $(evt.currentTarget).parent().removeClass('grid-form-error');
      }
   }
});

Template._gridElementNumber.events({
   'focusout input': function(evt,tpl) {
      var val = $(evt.currentTarget).val();
      if((parseInt(val, 10) && val.length > 0) || ( parseFloat(val) && val.length > 0)) {
         $(evt.currentTarget).parent().removeClass('grid-form-error');
      } else if(val.length == '0') {
         $(evt.currentTarget).parent().removeClass('grid-form-error');
      } else {
         $(evt.currentTarget).parent().addClass('grid-form-error');
      }
   }
});

Template._gridElementEmail.events({
   'focusout input': function(evt,tpl) {
      var val = $(evt.currentTarget).val();
      if(val.length > 0) {
         if(validateEmail(val)) {
            $(evt.currentTarget).parent().removeClass('grid-form-error');
         } else {
            $(evt.currentTarget).parent().addClass('grid-form-error');
         }
      } else {
         $(evt.currentTarget).parent().removeClass('grid-form-error');
      }
   }
});
