// LedgerWeave Consensus Core
// Multi-phase rule-based consensus simulation system

// ---------------- CORE LEDGER ----------------
class Ledger {
    constructor() {
        this.records = [];
    }

    append(entry) {
        this.records.push({
            id: this.records.length,
            data: entry.data,
            approvedBy: entry.approvedBy
        });
    }

    snapshot() {
        return this.records;
    }
}

// ---------------- VALIDATOR ENTITY ----------------
class Validator {
    constructor(id, stakeWeight) {
        this.id = id;
        this.stakeWeight = stakeWeight;
        this.activityScore = 1;
    }

    computeInfluence() {
        // Influence grows with stake and activity
        return this.stakeWeight * this.activityScore;
    }
}

// ---------------- STAKING POOL ----------------
class StakingPool {
    constructor() {
        this.validators = [];
    }

    addValidator(id, stakeWeight) {
        this.validators.push(new Validator(id, stakeWeight));
    }

    getActiveValidators() {
        return this.validators;
    }

    totalStake() {
        return this.validators.reduce((sum, v) => sum + v.stakeWeight, 0);
    }
}

// ---------------- CONSENSUS ENGINE ----------------
class ConsensusEngine {
    constructor(pool, ledger) {
        this.pool = pool;
        this.ledger = ledger;
    }

    evaluateProposal(proposal) {
        const approvals = [];

        const validators = this.pool.getActiveValidators();
        const requiredThreshold = this.pool.totalStake() * 0.5;

        // Multi-validator evaluation phase
        for (const v of validators) {
            const influence = v.computeInfluence();

            if (influence >= requiredThreshold / validators.length) {
                approvals.push(v.id);
            }
        }

        return {
            data: proposal,
            approvedBy: approvals
        };
    }

    finalizeBlock(evaluated) {
        const validatorsCount = this.pool.getActiveValidators().length;

        // Consensus rule: majority approval required
        if (evaluated.approvedBy.length > validatorsCount / 2) {
            this.ledger.append(evaluated);
            console.log("Consensus achieved → block committed");
        } else {
            console.log("Consensus failed → block rejected");
        }
    }
}

// ---------------- SIMULATION PIPELINE ----------------

// Initialize system components
const ledger = new Ledger();
const pool = new StakingPool();

// Register validators with staking power
pool.addValidator("V-A", 40);
pool.addValidator("V-B", 70);
