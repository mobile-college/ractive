import removeFromArray from 'utils/removeFromArray';
import runloop from 'global/runloop';
import notifyDependants from 'shared/notifyDependants';

var empty = {};

var UnresolvedImplicitDependency = function ( viewmodel, keypath ) {
	this.viewmodel = viewmodel;

	this.root = viewmodel.ractive; // TODO eliminate this
	this.ref = keypath;
	this.parentFragment = empty;

	viewmodel.unresolvedImplicitDependencies[ keypath ] = true;
	viewmodel.unresolvedImplicitDependencies.push( this );

	runloop.addUnresolved( this );
};

UnresolvedImplicitDependency.prototype = {
	resolve: function () {
		notifyDependants( this.viewmodel.ractive, this.ref );

		this.viewmodel.unresolvedImplicitDependencies[ this.ref ] = false;
		removeFromArray( this.viewmodel.unresolvedImplicitDependencies, this );
	},

	teardown: function () {
		runloop.removeUnresolved( this );
	}
};

export default UnresolvedImplicitDependency;