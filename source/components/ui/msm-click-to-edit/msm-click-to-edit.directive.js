/** Based on https://github.com/GabiGrin/angular-editable-text */
(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name components.ui.msmEditableText
   * @restrict 'E'
   *
   * @description Renders an editable text input
   *
   * @param {string} msmEditableText The model to be edited
   * @param {string} editMode The edit mode
   * @param {string} placeholder The placeholder for the model if empty
   * @param {function} onChange A callback function on model change
   */
  angular.module('msm.components.ui')
      .directive('msmEditableText', EditableText);

  function EditableText() {
    return {
      scope: {
        msmEditableText: '=',
        editMode: '=',
        placeholder: '@',
        onChange: '&'
      },
      transclude: true,
      templateUrl: 'components/ui/msm-click-to-edit/msm-click-to-edit.html',
      link: function (scope, elem, attrs) {
        var input = elem.find('input');
        var lastValue;
        scope.saveValue = true;
        scope.isEditing = !!scope.editMode;
        scope.editingValue = scope.msmEditableText;

        scope.onBlur = function() {
          scope.isEditing = false;
        };

        scope.onKeyPress = function(event) {
          if (event) {
            // enter
            if (event.which === 13) {
              scope.isEditing = false;
            }
            // escape
            if (event.which === 27) {
              scope.saveValue = false;
              scope.isEditing = false;
            }
          }
        };

        scope.onClick = function() {
          scope.isEditing = true;
        };

        scope.onFocus = function() {
          scope.isEditing = true;
        };

        elem.addClass('editable-text');

        scope.$watch('isEditing',
            function (val, oldVal) {
              if (attrs.editMode !== undefined) {
                scope.editMode = val;
              }
              if (val) {
                elem['addClass']('editing');
                var inputElm = input[0];
                inputElm.focus();
                // fix for FF
                var tmp = scope.editingValue ? scope.editingValue.length : 0;
                inputElm.selectionStart = tmp;
                inputElm.selectionEnd = tmp;
              } else {
                elem['removeClass']('editing');
                var editPromise;
                if(!scope.saveValue) {
                  scope.saveValue = true;
                  scope.editingValue = scope.msmEditableText;
                  return;
                }
                if (attrs.onChange && val !== oldVal && scope.editingValue !== lastValue) {
                  // accept promise, or a normal function
                  editPromise = scope.onChange({value: scope.editingValue});
                  if (editPromise && editPromise.then) {
                    scope.isWorking = true;
                    editPromise.then(
                        function (value) {
                          scope.msmEditableText = value;
                          scope.editingValue = value;
                          scope.isWorking = false;
                        }, function () {
                          scope.editingValue = scope.msmEditableText;
                          scope.isWorking = false;
                        }
                    );
                  } else if (editPromise) {
                    scope.msmEditableText = editPromise;
                    scope.editingValue = editPromise;
                  } else {
                    scope.msmEditableText = scope.editingValue;
                  }
                } else {
                  scope.msmEditableText = scope.editingValue;
                }
              }
            }
        );

        scope.$watch('editMode', function (val) {
          scope.isEditing = !!val;
        });

        scope.$watch('msmEditableText', function (newVal) {
          lastValue = newVal;
          scope.editingValue = newVal;
        });
      }
    }
  }

})();
