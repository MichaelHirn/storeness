(function($) {


		var curpage = 1;
		var id = null;
		var settings = null;
		
		jQuery.fn.transitionPage = function(from,to) {
		
			if (settings.transitionFunction) {
				settings.transitionFunction(from,to);
			} else {
				$(from).hide();
				$(to).show();
			}
			$(id + ' fieldset').removeClass('active');
			$(to).addClass('active');		
		}
		
		jQuery.fn.showState = function(page) { 
			
			if (settings.stateFunction) { 
				return settings.stateFunction(id+"_nav .multipage_state",page,settings.pages.length);
			}
			var state = '';
			for (x = 1; x <= settings.pages.length; x++) {
				if(x==page) {
					state = state + settings.activeDot;
				} else {
					state = state + settings.inactiveDot;
				}
			}
			$(id+"_nav .multipage_state").html(state);	
		}

		
		jQuery.fn.gotopage = function(page) {
			$(id + '_nav .multipage_next').html('Weiter');				
			
			if (isNaN(page)) { 
				q = page;
				page = 1;
				$(id+' fieldset').each(function(index) {
					if ('#'+$(this).attr('id')==q) { 
						curpage = page = index+1;
					}
				});
			}

			var np = null;
			var cp = $(id+' fieldset.active');
			// show the appropriate page.
			$(id+' fieldset').each(function(index) {
				index++;
				if (index==page) {		
					np = this;
				}
			});
			
			$(this).transitionPage(cp,np);
			
			$(this).showState(page);

			$(id + '_nav .multipage_next').removeClass('submit');				
			
			// is there a legend tag for this fieldset?
			// if so, pull it out.
			page_title = settings.pages[page-1].title;
			
			if (settings.stayLinkable) { 
				hashtag = '#' + settings.pages[page-1].id;
				document.location.hash = hashtag;
			}
			if (page==1) {
				// set up for first page
				$(id + '_nav .multipage_back').hide();
				$(id + '_nav .multipage_next').show();
				if (settings.pages[page].title) {
					$(id + '_nav .multipage_next').html('Weiter: ' + settings.pages[page].title);
				} else {
					$(id + '_nav .multipage_next').html('Weiter');
				}

			} else if (page==settings.pages.length) { 
				// set up for last page
				$(id + '_nav .multipage_back').show();
				$(id + '_nav .multipage_next').show();

				if (settings.pages[page-2].title) { 
					$(id + '_nav .multipage_back').html('Back: ' + settings.pages[page-2].title);
				} else {
					$(id + '_nav .multipage_back').html('Back');				
				}

				$(id + '_nav .multipage_next').addClass('submit');				
				$(id + '_nav .multipage_next').html(settings.submitLabel);				
				
			} else {
				if (settings.pages[page-2].title) { 
					$(id + '_nav .multipage_back').html('Back: ' + settings.pages[page-2].title);
				} else {
					$(id + '_nav .multipage_back').html('Back');				
				}
				if (settings.pages[page].title) {
					$(id + '_nav .multipage_next').html('Weiter: ' + settings.pages[page].title);
				} else {
					$(id + '_nav .multipage_next').html('Weiter');
				}

				$(id + '_nav .multipage_back').show();
				$(id + '_nav .multipage_next').show();				

			}
			
			$(id + ' fieldset.active input:first').focus();
			curpage=page;
			return false;
			
		}
		
	jQuery.fn.validatePage = function(page) { 
		$('#multipage').validation({
			// pass an array of required field objects
			required: [
				{
					name: 'branche',
				},
				{
					name: 'umsatz',
				},
				{
					name: 'name',
				},
				{
					name: 'email',
					validate: function($el) {
						return $el.val().match('@') !== null;
					}
				}
			],
			// callback for failed validaiton on form submit
			fail: function() {
				Gumby.error('Form validation failed');
			},
			// callback for successful validation on form submit
			// if omited, form will submit normally
			submit: function(data) {
				$.ajax({
					url: 'contact.php',
					data: data,
					success: function() {
						$('#multipage_nav').remove();
						$('#multipage').html('<p>Vielen Dank für Ihre Anfrage.<br/>Wir melden uns so schnell wie möglich bei Ihnen.</p>');
					}
				});
			} 
		});			
		return true;
	}

		
	jQuery.fn.validateAll = function() { 
		for (x = 1; x <= settings.pages.length; x++) {
			if (!$(this).validatePage(x)) {
				$(this).gotopage(x);
				return false;
			}
		}
		return true;
	}	

		
	jQuery.fn.gotofirst = function() {
		curpage = 1;
		$(this).gotopage(curpage);
		return false;
	}
	jQuery.fn.gotolast = function() {
		curpage = settings.pages.length;
		$(this).gotopage(curpage);
		return false;
	}

	jQuery.fn.nextpage = function() {
			// validate the current page
			if ($(this).validatePage(curpage)) { 
				curpage++;
	
				if (curpage > settings.pages.length) {
					// submit!
					$(this).submit();
					 curpage = settings.pages.length;
					 return false;
				}
				$(this).displayResult($(this).checkValueSum());
				$(this).gotopage(curpage);
			}
			return false;
		
	}

	jQuery.fn.checkValueSum = function() {
		var one = $('input[name=branche]:checked', '#multipage').val();
		var two = $('input[name=umsatz]:checked', '#multipage').val()
		var sum = parseInt(one) + parseInt(two);
		return sum;	
	}

	jQuery.fn.displayResult = function(sum) {
		if(sum >= 2) 
		{
			$('#contact_maybe').css('display', 'none');
			$('#contact_true').css('display', 'inline-block');
		} else 
		{
			$('#contact_true').css('display', 'none');
			$('#contact_maybe').css('display', 'inline-block');
		}	
	}
	
	jQuery.fn.getPages = function() {
		return settings.pages;
	}
		
	jQuery.fn.prevpage = function() {

		curpage--;

		if (curpage < 1) {
			 curpage = 1;
		}
		$(this).gotopage(curpage);
		return false;
		
	}
	
	
	jQuery.fn.multipage = function(options) { 
		
		settings = jQuery.extend({stayLinkable:false,submitLabel:'Submit',hideLegend:false,hideSubmit:true,generateNavigation:true,activeDot:'&nbsp;&#x25CF;',inactiveDot:'&nbsp;&middot;'},options);
		id = '#' + $(this).attr('id');
		var form = $(this);			
		
		form.addClass('multipage');
		
		form.submit(function(e) {
			if (!$(this).validateAll()) {
				e.preventDefault()
			};
		});
		
		// hide all the pages 
		$(id +' fieldset').hide();
			if (settings.hideSubmit) { 
				$(id+' input[type="submit"]').hide();
			}		
			
			if ($(id+' input[type="submit"]').val()!='') { 
				settings.submitLabel = $(id+' input[type="submit"]').val();
			}
			
			settings.pages = new Array();
			
			$(this).children('fieldset').each(function(index) { 
				label = $(this).children('legend').html();
				settings.pages[index] = {number:index+1,title:label,id:$(this).attr('id')};
			});
			
			
			if (settings.hideLegend) { 
				// hide legend tags
				$(id+' fieldset legend').hide();
			}
			
			// show the first page.
			$(id+' fieldset:first').addClass('active');

			$(id+' fieldset:first').show();
									
			if (settings.generateNavigation) { 
				if (settings.navigationFunction) { 
					settings.navigationFunction($(this).getPages());
				} else {
					// insert navigation
                                        var id_name = $(this).attr('id');
                                        $('<div class="multipage_nav" id="'+id_name+'_nav"><div class="medium success btn" style="width: 100%;"><a href="#" onclick="return $(\''+id+'\').nextpage();">Weiter</a></div><div class="clearer"></div></div>').insertAfter(this);
				}
			}				
			
			if (document.location.hash) { 
				$(this).gotopage('#'+document.location.hash.substring(1,document.location.hash.length));
			} else {
				$(this).gotopage(1);			
			}	
			return false;
		
		}
		

})(jQuery);

$(window).ready(function() {
	            $('#multipage').multipage();
});
