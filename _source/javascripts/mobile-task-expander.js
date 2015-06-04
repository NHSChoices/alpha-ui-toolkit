$(function () {
    'use strict';
    
    // Mobile task list expander buttons
    $('.content-links-multicolour .task').each(function () {
        var task = $(this);
        var list = $(this).find('ul');
        var button = $('<button class="task__expander btn btn-link" type="button"></button>');
        
        button.append('<span class="task__open">+<span class="sr-only"> open</span></span>');
        button.append('<span class="task__close">-<span class="sr-only"> close</span></span>');
        $(this).find('.task__header').append(button);
        
        button.click(function () {
           list.slideToggle(100, function () {
              // Control visibility with classes instead of the style attribute
              if ($(this).is(':visible')) {
                  task.addClass('task--listOpen');
              } else {
                  task.removeClass('task--listOpen');
              }
              $(this).css('display', '');
           });
        });
    });
});
