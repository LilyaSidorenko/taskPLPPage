$(document).ready(function () {
    var catalog = $('.js-catalog'),
        product = $('.js-product'),
        result = $('.js-result'),
        sorting = $('.js-sort'),
        rating = $('.js-rating'),
        showCount = $('#showCount'),
        filterLink = $('.filters-view__link'),
        filterView = $('.filters-view'),
        filterTemplate = $('#filters-template'),
        productTemplate = $('#product-template');

    var template = Handlebars.compile(productTemplate.html());
    catalog.append(template('/data/site.json'));

    filterLink.on('click', function () {

        var templateFilters = Handlebars.compile(filterTemplate.html());
        if (!filterLink.hasClass('active')) {
            filterView.prepend(templateFilters)
        }
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            var attrValue = $(this).attr('data-href');

            var findItem = catalog.find("[data-attr='" + attrValue + "']");

            product.addClass('hidden');
            findItem.addClass('active');

            var resultTemplate = '<div class="filters-view__selected-item">' + this.outerHTML + '<a class="filters-view__remove js-button-remove"></a></div>';

            $('.js-filters-title').after(resultTemplate);
        }


    });
    $(document).on('click', '.js-button-remove', function () {
        var filterViewSelected = $('.filters-view__selected-item');
        if (filterViewSelected.length > 1) {
            var attrDelValue = $(this).prev().attr('data-href');

            var findDelItem = catalog.find("[data-attr='" + attrDelValue + "']");
            findDelItem.removeClass('active');
            findDelItem.addClass('hidden');
            $(this).parent().remove();
        } else {
            $('.js-result').remove();
            product.removeClass('hidden active');
        }
    });
    $(document).on("change", ".price-sorting", function () {
        var sortingMethod = $(this).val();
        var product = $('.js-product');

        if (sortingMethod == 'Price Asc.') {
            product.sort(function (a, b) {
                return $(a).data("price") - $(b).data("price")
            });
            catalog.html(product);
        }
        else if (sortingMethod == 'Price Desc.') {
            product.sort(function (a, b) {
                return $(b).data("price") - $(a).data("price")
            });
            catalog.html(product);
        }

    });

    sorting.on('click', function () {
        sorting.removeClass('active');
        $(this).addClass('active');
        catalog.attr('data-sort', $(this).attr('data-sort'));
    });

    showCount.on('change', function () {
        $.getJSON('/data/site.json', function (data) {
            template = Handlebars.compile(productTemplate.html());
            catalog.append(template(data));
        });
    });
    $('.js-rating').each(function () {
        var ratingAmount = $(this).attr('data-rating') * 20;
        $(this).css('width', ratingAmount + '%');
    });
});
