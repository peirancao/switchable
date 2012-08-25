define(function(require, exports, module) {

    var Switchable = require('./switchable');
    var $ = require('$');
    var CONST = require('./const');


    // 旋转木马组件
    module.exports = Switchable.extend({

        attrs: {
            circular: true,

            prevBtn: {
                getter: function(val) {
                    return $(val).eq(0);
                }
            },

            nextBtn: {
                getter: function(val) {
                    return $(val).eq(0);
                }
            }
        },

        _parseRole: function() {
            Switchable.prototype._parseRole.call(this);

            // var role = this.dataset && this.dataset.role;
            var role = this._getDatasetRole();
            if (!role) return;
            // attr 里没找到时，才根据 data-role 来解析
            var prevBtn = this.get('prevBtn');
            var nextBtn = this.get('nextBtn');

            if (!prevBtn[0] && role.prev) {
                prevBtn = role.prev;
                console.info(1, prevBtn)
                this.set('prevBtn', prevBtn);
            }

            if (!nextBtn[0] && role.next) {
                nextBtn = role.next;
                console.info(2, nextBtn)
                this.set('nextBtn', nextBtn);
            }

            prevBtn.addClass(CONST.PREV_BTN_CLASS);
            nextBtn.addClass(CONST.NEXT_BTN_CLASS);
        },

         _getDatasetRole: function() {
            var element = this.element;
            var role = {};
            var roles = ['next', 'prev'];
            $.each(roles, function(index, key) {
              var elems = $('[data-role=' + key + ']', element); 
              if (elems.length) {
                role[key] = elems;
                isHaveRole = true;
              }
            });
            if (!isHaveRole) return null;
            return role;
        },

        _initTriggers: function() {
            Switchable.prototype._initTriggers.call(this);

            var that = this;
            var circular = this.get('circular');

            this.get('prevBtn').click(function(ev) {
                ev.preventDefault();
                if (circular || that.get('activeIndex') > 0) {
                    that.prev();
                }
            });

            this.get('nextBtn').click(function(ev) {
                ev.preventDefault();
                var len = that.get('length') - 1;
                if (circular || that.get('activeIndex') < len) {
                    that.next();
                }
            });

            // 注册 switch 事件，处理 prevBtn/nextBtn 的 disable 状态
            // circular = true 时，无需处理
            if (!circular) {
                this.on('switch', function(toIndex) {
                    that._updateButtonStatus(toIndex);
                });
            }
        },

        _updateButtonStatus: function(toIndex) {
            var prevBtn = this.get('prevBtn');
            var nextBtn = this.get('nextBtn');

            prevBtn.removeClass(CONST.DISABLED_BTN_CLASS);
            nextBtn.removeClass(CONST.DISABLED_BTN_CLASS);

            if (toIndex === 0) {
                prevBtn.addClass(CONST.DISABLED_BTN_CLASS);
            }
            else if (toIndex === this.get('length') - 1) {
                nextBtn.addClass(CONST.DISABLED_BTN_CLASS);
            }
        }

    });

});
